-- name: CreateUser :one
INSERT INTO users (id, display_name)
VALUES ($1, $2)
RETURNING *;

-- name: GetUser :one
SELECT * FROM users
WHERE id = $1 LIMIT 1;

-- name: CreateRoom :one
INSERT INTO rooms (id, name, description)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetRoom :one
SELECT * FROM rooms
WHERE id = $1 LIMIT 1;

-- name: ListActiveRooms :many
SELECT * FROM rooms
WHERE is_active = true
ORDER BY last_activity_at DESC
LIMIT $1 OFFSET $2;

-- name: CreateMessage :one
INSERT INTO messages (id, room_id, user_id, content)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetRoomMessages :many
SELECT * FROM messages
WHERE room_id = $1 AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;
