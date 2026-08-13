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

type RoomsHandler struct {
	db *database.DB
}

func NewRoomsHandler(db *database.DB) *RoomsHandler {
	return &RoomsHandler{db: db}
}

type CreateRoomRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

func (h *RoomsHandler) CreateRoom(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Validate session from context (middleware sets this)
	_, ok := r.Context().Value(middleware.UserContextKey).(*auth.SessionClaims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var req CreateRoomRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if len(req.Name) < 3 || len(req.Name) > 50 {
		http.Error(w, "Room name must be between 3 and 50 characters", http.StatusBadRequest)
		return
	}

	descriptionText := pgtype.Text{String: req.Description, Valid: true}
	if req.Description == "" {
		descriptionText.Valid = false
	}

	roomID := "room_" + auth.GenerateUserID()[4:] // quick random ID reuse
	room, err := h.db.Queries.CreateRoom(r.Context(), database.CreateRoomParams{
		ID:          roomID,
		Name:        req.Name,
		Description: descriptionText,
	})
	if err != nil {
		http.Error(w, "Failed to create room", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(room)
}

func (h *RoomsHandler) ListRooms(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	rooms, err := h.db.Queries.ListActiveRooms(r.Context(), database.ListActiveRoomsParams{
		Limit:  50,
		Offset: 0,
	})
	if err != nil {
		http.Error(w, "Failed to fetch rooms", http.StatusInternalServerError)
		return
	}

	if rooms == nil {
		rooms = []database.Room{} // Return empty array instead of null
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(rooms)
}

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

	// We need to map the database.Message to the expected MessagePayload format for the frontend
	type MessagePayload struct {
		RoomID      string `json:"room_id"`
		Content     string `json:"content"`
		SenderID    string `json:"sender_id"`
		DisplayName string `json:"display_name"`
		CreatedAt   string `json:"created_at"`
	}

	var payloads []MessagePayload
	for _, m := range messages {
		// We'd normally join with users table to get display name.
		// For simplicity, we just use the user ID as display name here or do a quick lookup.
		// Since we didn't join in GetRoomMessages, let's just mock the display name for history
		// or fetch it individually (not optimal, but fine for now) or modify the SQL.
		// Let's modify the SQL later, for now just use "User"
		payloads = append(payloads, MessagePayload{
			RoomID:      m.RoomID,
			Content:     m.Content,
			SenderID:    m.UserID,
			DisplayName: "Unknown User", // Requires SQL JOIN to get actual name
			CreatedAt:   m.CreatedAt.Time.Format("2006-01-02T15:04:05Z07:00"),
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(payloads)
}
