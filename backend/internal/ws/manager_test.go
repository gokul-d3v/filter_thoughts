package ws

import (
	"testing"
)

// A basic unit test to verify client addition and removal tracking
func TestManager_AddRemoveClient(t *testing.T) {
	manager := NewManager(nil) // DB not needed for this basic test

	client := &Client{
		UserID:      "test_user",
		DisplayName: "Test User",
		Rooms:       make(map[string]bool),
		MessageChan: make(chan []byte, 10),
	}

	manager.AddClient(client)

	if !manager.clients[client] {
		t.Errorf("expected client to be added to manager")
	}

	// Fake joining a room
	manager.rooms["test_room"] = make(map[*Client]bool)
	manager.rooms["test_room"][client] = true
	client.Rooms["test_room"] = true

	manager.RemoveClient(client)

	if manager.clients[client] {
		t.Errorf("expected client to be removed from manager")
	}

	if manager.rooms["test_room"][client] {
		t.Errorf("expected client to be removed from room")
	}
}
