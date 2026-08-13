package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/veritas-chat/backend/internal/auth"
	"github.com/veritas-chat/backend/internal/database"
	"github.com/veritas-chat/backend/internal/http/middleware"
)

// ... existing code ...

func (h *RoomsHandler) GetRoomMessages(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	roomID := chi.URLParam(r, "roomId")
	if roomID == "" {
		http.Error(w, "Room ID required", http.StatusBadRequest)
		return
	}

	messages, err := h.db.Queries.GetRoomMessages(r.Context(), database.GetRoomMessagesParams{
		RoomID: roomID,
		Limit:  50,
		Offset: 0,
	})
	if err != nil {
		http.Error(w, "Failed to fetch messages", http.StatusInternalServerError)
		return
	}

	if messages == nil {
		messages = []database.Message{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(messages)
}
