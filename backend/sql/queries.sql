-- name: CreateUser :one
INSERT INTO users (id, display_name)
VALUES ($1, $2)
RETURNING *;

-- name: GetUser :one
SELECT * FROM users
WHERE id = $1 LIMIT 1;

-- name: CreateRoom :one
INSERT INTO rooms (id, name, description, is_private, join_code)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: GetRoom :one
SELECT * FROM rooms
WHERE id = $1 LIMIT 1;

-- name: ListActiveRooms :many
SELECT * FROM rooms
WHERE is_active = true AND is_private = false
ORDER BY last_activity_at DESC
LIMIT $1 OFFSET $2;

-- name: GetRoomByJoinCode :one
SELECT * FROM rooms
WHERE join_code = $1 AND is_active = true LIMIT 1;

-- name: CreateMessage :one
INSERT INTO messages (id, room_id, user_id, content)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetRoomMessages :many
SELECT * FROM messages
WHERE room_id = $1 AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;

-- name: UpsertPresence :exec
INSERT INTO room_presence (room_id, user_id, last_seen_at)
VALUES ($1, $2, CURRENT_TIMESTAMP)
ON CONFLICT (room_id, user_id) 
DO UPDATE SET last_seen_at = CURRENT_TIMESTAMP;

-- name: RemovePresence :exec
DELETE FROM room_presence
WHERE room_id = $1 AND user_id = $2;

-- name: GetRoomPresenceCount :one
SELECT COUNT(*) FROM room_presence
WHERE room_id = $1 AND last_seen_at > CURRENT_TIMESTAMP - INTERVAL '5 minutes';

-- name: CreateReport :one
INSERT INTO reports (id, message_id, reporter_id, reason)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: SoftDeleteMessage :exec
UPDATE messages 
SET deleted_at = CURRENT_TIMESTAMP 
WHERE id = $1 AND user_id = $2;

-- name: ListReports :many
SELECT r.id, r.message_id, r.reporter_id, r.reason, r.created_at, 
       m.content as message_content, m.user_id as message_author_id
FROM reports r
JOIN messages m ON r.message_id = m.id
ORDER BY r.created_at DESC
LIMIT $1 OFFSET $2;
