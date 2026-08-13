package handlers

import (
	"log"
	"net/http"

	"github.com/coder/websocket"
	"github.com/veritas-chat/backend/internal/auth"
	"github.com/veritas-chat/backend/internal/http/middleware"
	"github.com/veritas-chat/backend/internal/ws"
)

type WSHandler struct {
	manager *ws.Manager
}

func NewWSHandler(manager *ws.Manager) *WSHandler {
	return &WSHandler{manager: manager}
}

func (h *WSHandler) HandleConnection(w http.ResponseWriter, r *http.Request) {
	// Require session
	claims, ok := r.Context().Value(middleware.UserContextKey).(*auth.SessionClaims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Upgrade HTTP to WebSocket
	conn, err := websocket.Accept(w, r, &websocket.AcceptOptions{
		InsecureSkipVerify: true, // For local dev CORS (remove in prod)
	})
	if err != nil {
		log.Printf("Failed to accept websocket: %v", err)
		return
	}

	client := ws.NewClient(h.manager, conn, claims.UserID, claims.DisplayName)
	h.manager.AddClient(client)

	// Start reading and writing concurrently
	go client.WritePump(r.Context())
	client.ReadPump(r.Context()) // Blocking
}
