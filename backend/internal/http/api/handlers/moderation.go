package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/veritas-chat/backend/internal/auth"
	"github.com/veritas-chat/backend/internal/database"
	"github.com/veritas-chat/backend/internal/http/middleware"
)

type ModerationHandler struct {
	db *database.DB
}

func NewModerationHandler(db *database.DB) *ModerationHandler {
	return &ModerationHandler{db: db}
}

type ReportRequest struct {
	Reason string `json:"reason"`
}

func (h *ModerationHandler) ReportMessage(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(*auth.SessionClaims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	msgID := chi.URLParam(r, "messageId")
	if msgID == "" {
		http.Error(w, "Message ID required", http.StatusBadRequest)
		return
	}

	var req ReportRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	reportID := "rep_" + uuid.New().String()

	_, err := h.db.Queries.CreateReport(r.Context(), database.CreateReportParams{
		ID:         reportID,
		MessageID:  msgID,
		ReporterID: claims.UserID,
		Reason:     req.Reason,
	})
	if err != nil {
		http.Error(w, "Failed to create report", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func (h *ModerationHandler) DeleteMessage(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(*auth.SessionClaims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	msgID := chi.URLParam(r, "messageId")
	if msgID == "" {
		http.Error(w, "Message ID required", http.StatusBadRequest)
		return
	}

	err := h.db.Queries.SoftDeleteMessage(r.Context(), database.SoftDeleteMessageParams{
		ID:     msgID,
		UserID: claims.UserID, // Only allow deleting own messages
	})
	if err != nil {
		http.Error(w, "Failed to delete message", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *ModerationHandler) ListReports(w http.ResponseWriter, r *http.Request) {
	// In a real app, we'd verify admin role here. 
	// For this prototype, we'll just require a valid session.
	_, ok := r.Context().Value(middleware.UserContextKey).(*auth.SessionClaims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	reports, err := h.db.Queries.ListReports(r.Context(), database.ListReportsParams{
		Limit:  50,
		Offset: 0,
	})
	if err != nil {
		http.Error(w, "Failed to list reports", http.StatusInternalServerError)
		return
	}

	if reports == nil {
		reports = []database.ListReportsRow{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(reports)
}
