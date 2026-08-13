package ws

import "encoding/json"

// EventType defines the type of message being sent
type EventType string

const (
	EventMessage   EventType = "message"
	EventJoinRoom  EventType = "join_room"
	EventLeaveRoom EventType = "leave_room"
	EventError     EventType = "error"
)

// Event is the generic envelope for all WebSocket messages
type Event struct {
	Type    EventType       `json:"type"`
	Payload json.RawMessage `json:"payload"`
}

// JoinRoomPayload is sent by the client to subscribe to a room
type JoinRoomPayload struct {
	RoomID string `json:"room_id"`
}

// LeaveRoomPayload is sent by the client to unsubscribe from a room
type LeaveRoomPayload struct {
	RoomID string `json:"room_id"`
}

// MessagePayload is used for sending chat messages
type MessagePayload struct {
	RoomID      string `json:"room_id"`
	Content     string `json:"content"`
	SenderID    string `json:"sender_id,omitempty"` // populated by server
	DisplayName string `json:"display_name,omitempty"` // populated by server
	CreatedAt   string `json:"created_at,omitempty"`
}

// ErrorPayload is sent by the server when something goes wrong
type ErrorPayload struct {
	Message string `json:"message"`
}
