package ws

import (
	"context"
	"encoding/json"
	"log"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/microcosm-cc/bluemonday"
	"github.com/veritas-chat/backend/internal/database"
)

// Manager keeps track of all active clients and rooms
type Manager struct {
	clients map[*Client]bool
	rooms   map[string]map[*Client]bool
	sync.RWMutex
	db *database.DB
}

func NewManager(db *database.DB) *Manager {
	return &Manager{
		clients: make(map[*Client]bool),
		rooms:   make(map[string]map[*Client]bool),
		db:      db,
	}
}

func (m *Manager) AddClient(client *Client) {
	m.Lock()
	defer m.Unlock()
	m.clients[client] = true
	log.Printf("Client connected: %s", client.UserID)
}

func (m *Manager) RemoveClient(client *Client) {
	m.Lock()
	defer m.Unlock()
	
	if _, ok := m.clients[client]; ok {
		// Remove from all rooms
		for roomID := range client.Rooms {
			if roomClients, ok := m.rooms[roomID]; ok {
				delete(roomClients, client)
				if len(roomClients) == 0 {
					delete(m.rooms, roomID)
				}
			}
		}
		delete(m.clients, client)
		close(client.MessageChan)
		log.Printf("Client disconnected: %s", client.UserID)
	}
}

// HandleEvent routes incoming websocket events
func (m *Manager) HandleEvent(client *Client, event Event) {
	switch event.Type {
	case EventJoinRoom:
		var payload JoinRoomPayload
		if err := json.Unmarshal(event.Payload, &payload); err == nil {
			m.joinRoom(client, payload.RoomID)
		}
	case EventLeaveRoom:
		var payload LeaveRoomPayload
		if err := json.Unmarshal(event.Payload, &payload); err == nil {
			m.leaveRoom(client, payload.RoomID)
		}
	case EventMessage:
		var payload MessagePayload
		if err := json.Unmarshal(event.Payload, &payload); err == nil {
			m.broadcastMessage(client, payload)
		}
	default:
		client.SendError("Unknown event type")
	}
}

func (m *Manager) joinRoom(client *Client, roomID string) {
	m.Lock()
	if m.rooms[roomID] == nil {
		m.rooms[roomID] = make(map[*Client]bool)
	}
	m.rooms[roomID][client] = true
	client.Rooms[roomID] = true
	m.Unlock()
	
	log.Printf("Client %s joined room %s", client.UserID, roomID)

	// Persist Presence
	err := m.db.Queries.UpsertPresence(context.Background(), database.UpsertPresenceParams{
		RoomID: roomID,
		UserID: client.UserID,
	})
	if err != nil {
		log.Printf("Failed to upsert presence: %v", err)
	}

	// Broadcast system message
	m.broadcastSystemMessage(roomID, client.DisplayName+" joined the room.")
}

func (m *Manager) leaveRoom(client *Client, roomID string) {
	m.Lock()
	if roomClients, ok := m.rooms[roomID]; ok {
		delete(roomClients, client)
		if len(roomClients) == 0 {
			delete(m.rooms, roomID)
		}
	}
	delete(client.Rooms, roomID)
	m.Unlock()
	
	log.Printf("Client %s left room %s", client.UserID, roomID)

	// Remove Presence
	err := m.db.Queries.RemovePresence(context.Background(), database.RemovePresenceParams{
		RoomID: roomID,
		UserID: client.UserID,
	})
	if err != nil {
		log.Printf("Failed to remove presence: %v", err)
	}

	// Broadcast system message
	m.broadcastSystemMessage(roomID, client.DisplayName+" left the room.")
}

func (m *Manager) StartPubSub(ctx context.Context) {
	conn, err := m.db.Pool.Acquire(ctx)
	if err != nil {
		log.Fatalf("Failed to acquire connection for pub/sub: %v", err)
	}
	defer conn.Release()

	_, err = conn.Exec(ctx, "LISTEN chat_messages")
	if err != nil {
		log.Fatalf("Failed to LISTEN to chat_messages: %v", err)
	}

	log.Println("Started PostgreSQL Pub/Sub listener for chat_messages")

	for {
		notification, err := conn.Conn().WaitForNotification(ctx)
		if err != nil {
			log.Printf("Error waiting for notification: %v", err)
			time.Sleep(1 * time.Second) // basic backoff
			continue
		}

		var event Event
		if err := json.Unmarshal([]byte(notification.Payload), &event); err != nil {
			log.Printf("Failed to unmarshal pub/sub event: %v", err)
			continue
		}

		// It's an EventMessage. Broadcast to local clients in the room.
		if event.Type == EventMessage {
			var msgPayload MessagePayload
			if err := json.Unmarshal(event.Payload, &msgPayload); err == nil {
				m.distributeToLocalClients(msgPayload.RoomID, []byte(notification.Payload))
			}
		}
	}
}

func (m *Manager) distributeToLocalClients(roomID string, eventBytes []byte) {
	m.RLock()
	defer m.RUnlock()

	if roomClients, ok := m.rooms[roomID]; ok {
		for client := range roomClients {
			select {
			case client.MessageChan <- eventBytes:
			default:
				go m.RemoveClient(client)
			}
		}
	}
}

func (m *Manager) broadcastSystemMessage(roomID, content string) {
	payload := MessagePayload{
		RoomID:      roomID,
		Content:     content,
		SenderID:    "system",
		DisplayName: "System",
		CreatedAt:   time.Now().Format(time.RFC3339),
	}
	
	msgBytes, _ := json.Marshal(payload)
	eventBytes, _ := json.Marshal(Event{
		Type:    EventMessage,
		Payload: msgBytes,
	})

	// NOTIFY Postgres
	m.db.Pool.Exec(context.Background(), "SELECT pg_notify('chat_messages', $1)", string(eventBytes))
}

func (m *Manager) broadcastMessage(sender *Client, payload MessagePayload) {
	// Only allow sending to rooms the client is in
	sender.Manager.RLock()
	if !sender.Rooms[payload.RoomID] {
		sender.Manager.RUnlock()
		sender.SendError("You must join the room before sending a message")
		return
	}
	sender.Manager.RUnlock()

	// Sanitize content to prevent XSS
	p := bluemonday.UGCPolicy()
	sanitizedContent := p.Sanitize(payload.Content)
	payload.Content = sanitizedContent

	msgID := "msg_" + uuid.New().String()
	now := time.Now()

	// Persist to database
	_, err := m.db.Queries.CreateMessage(context.Background(), database.CreateMessageParams{
		ID:      msgID,
		RoomID:  payload.RoomID,
		UserID:  sender.UserID,
		Content: payload.Content,
	})
	if err != nil {
		log.Printf("Failed to persist message: %v", err)
		sender.SendError("Failed to send message")
		return
	}

	// Decorate payload with server-side sender info
	payload.SenderID = sender.UserID
	payload.DisplayName = sender.DisplayName
	payload.CreatedAt = now.Format(time.RFC3339)

	msgBytes, _ := json.Marshal(payload)
	eventBytes, _ := json.Marshal(Event{
		Type:    EventMessage,
		Payload: msgBytes,
	})

	// NOTIFY Postgres
	_, err = m.db.Pool.Exec(context.Background(), "SELECT pg_notify('chat_messages', $1)", string(eventBytes))
	if err != nil {
		log.Printf("Failed to notify pg: %v", err)
	}
}
