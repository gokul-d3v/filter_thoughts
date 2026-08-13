package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/veritas-chat/backend/internal/auth"
	"github.com/veritas-chat/backend/internal/database"
)

type SessionHandler struct {
	db *database.DB
}

func NewSessionHandler(db *database.DB) *SessionHandler {
	return &SessionHandler{db: db}
}

func (h *SessionHandler) CreateSession(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID := auth.GenerateUserID()
	displayName := auth.GenerateDisplayName()

	// Persist the user in the database
	user, err := h.db.Queries.CreateUser(r.Context(), database.CreateUserParams{
		ID:          userID,
		DisplayName: displayName,
	})
	if err != nil {
		http.Error(w, "Failed to create user identity", http.StatusInternalServerError)
		return
	}

	token, err := auth.GenerateSessionToken(user.ID, user.DisplayName)
	if err != nil {
		http.Error(w, "Failed to generate session token", http.StatusInternalServerError)
		return
	}

	// Set secure HttpOnly cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "session_token",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		Secure:   true, // Requires HTTPS in prod
		SameSite: http.SameSiteStrictMode,
		Expires:  time.Now().Add(24 * time.Hour),
	})

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"user_id":      user.ID,
		"display_name": user.DisplayName,
	})
}
