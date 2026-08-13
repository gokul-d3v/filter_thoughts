package ws

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"github.com/coder/websocket"
)

// Client represents a single connected WebSocket client
type Client struct {
	Manager     *Manager
	Conn        *websocket.Conn
	UserID      string
	DisplayName string
	MessageChan chan []byte
	Rooms       map[string]bool // rooms the client is currently subscribed to
}

// NewClient creates a new client
func NewClient(manager *Manager, conn *websocket.Conn, userID, displayName string) *Client {
	return &Client{
		Manager:     manager,
		Conn:        conn,
		UserID:      userID,
		DisplayName: displayName,
		MessageChan: make(chan []byte, 256),
		Rooms:       make(map[string]bool),
	}
}

// ReadPump listens for messages from the WebSocket connection
func (c *Client) ReadPump(ctx context.Context) {
	defer func() {
		c.Manager.RemoveClient(c)
		c.Conn.Close(websocket.StatusNormalClosure, "connection closed")
	}()

	for {
		_, message, err := c.Conn.Read(ctx)
		if err != nil {
			if websocket.CloseStatus(err) == websocket.StatusNormalClosure ||
				websocket.CloseStatus(err) == websocket.StatusGoingAway {
				break
			}
			log.Printf("error reading from websocket: %v", err)
			break
		}

		var event Event
		if err := json.Unmarshal(message, &event); err != nil {
			c.SendError("Invalid message format")
			continue
		}

		c.Manager.HandleEvent(c, event)
	}
}

// WritePump sends messages from the MessageChan to the WebSocket connection
func (c *Client) WritePump(ctx context.Context) {
	defer func() {
		c.Conn.Close(websocket.StatusNormalClosure, "connection closed")
	}()

	for {
		select {
		case <-ctx.Done():
			return
		case message, ok := <-c.MessageChan:
			if !ok {
				c.Conn.Close(websocket.StatusNormalClosure, "channel closed")
				return
			}
			ctxTimeout, cancel := context.WithTimeout(ctx, time.Second*5)
			err := c.Conn.Write(ctxTimeout, websocket.MessageText, message)
			cancel()
			if err != nil {
				log.Printf("error writing to websocket: %v", err)
				return
			}
		}
	}
}

// SendError sends an error message to the client
func (c *Client) SendError(msg string) {
	errPayload, _ := json.Marshal(ErrorPayload{Message: msg})
	event, _ := json.Marshal(Event{Type: EventError, Payload: errPayload})
	
	select {
	case c.MessageChan <- event:
	default:
	}
}
