package api

import (
	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/veritas-chat/backend/internal/database"
	"github.com/veritas-chat/backend/internal/http/api/handlers"
	"github.com/veritas-chat/backend/internal/http/middleware"
	"github.com/veritas-chat/backend/internal/ws"
)

func NewRouter(db *database.DB, wsManager *ws.Manager) *chi.Mux {
	r := chi.NewRouter()

	// Default chi middlewares
	r.Use(chimiddleware.Logger)
	r.Use(chimiddleware.Recoverer)
	
	// Security & Rate Limiting middlewares
	r.Use(middleware.SecurityHeaders)
	r.Use(middleware.RateLimit)

	sessionHandler := handlers.NewSessionHandler(db)
	roomsHandler := handlers.NewRoomsHandler(db)
	wsHandler := handlers.NewWSHandler(wsManager)
	modHandler := handlers.NewModerationHandler(db)

	r.Route("/api/v1", func(r chi.Router) {
		r.Post("/sessions", sessionHandler.CreateSession)

		// Protected endpoints
		r.Group(func(r chi.Router) {
			r.Use(middleware.RequireSession)

			r.Get("/rooms", roomsHandler.ListRooms)
			r.Post("/rooms", roomsHandler.CreateRoom)
			r.Get("/rooms/{roomId}/messages", roomsHandler.GetRoomMessages)
			
			// Moderation
			r.Post("/messages/{messageId}/report", modHandler.ReportMessage)
			r.Delete("/messages/{messageId}", modHandler.DeleteMessage)
			
			// Admin
			r.Get("/admin/reports", modHandler.ListReports)

			// WebSocket upgrade endpoint
			r.Get("/ws", wsHandler.HandleConnection)
		})
	})

	return r
}
