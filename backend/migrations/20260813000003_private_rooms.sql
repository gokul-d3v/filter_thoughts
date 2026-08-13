-- +goose Up
-- +goose StatementBegin
ALTER TABLE rooms ADD COLUMN is_private BOOLEAN DEFAULT false;
ALTER TABLE rooms ADD COLUMN join_code VARCHAR(50);
CREATE UNIQUE INDEX idx_rooms_join_code ON rooms(join_code) WHERE join_code IS NOT NULL;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_rooms_join_code;
ALTER TABLE rooms DROP COLUMN join_code;
ALTER TABLE rooms DROP COLUMN is_private;
-- +goose StatementEnd
