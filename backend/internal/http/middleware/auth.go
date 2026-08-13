package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/veritas-chat/backend/internal/auth"
)

type contextKey string

const (
	UserContextKey contextKey = "user"
)

// RequireSession validates the JWT in the Authorization header or cookie
func RequireSession(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenStr := ""
		
		// Try Authorization header first
		authHeader := r.Header.Get("Authorization")
		if strings.HasPrefix(authHeader, "Bearer ") {
			tokenStr = strings.TrimPrefix(authHeader, "Bearer ")
		}

		// Fallback to cookie
		if tokenStr == "" {
			cookie, err := r.Cookie("session_token")
			if err == nil {
				tokenStr = cookie.Value
			}
		}

		if tokenStr == "" {
			http.Error(w, "Unauthorized: missing session token", http.StatusUnauthorized)
			return
		}

		claims, err := auth.VerifySessionToken(tokenStr)
		if err != nil {
			http.Error(w, "Unauthorized: invalid session token", http.StatusUnauthorized)
			return
		}

		// Add claims to context
		ctx := context.WithValue(r.Context(), UserContextKey, claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
