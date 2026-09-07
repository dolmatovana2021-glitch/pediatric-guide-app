CREATE TABLE IF NOT EXISTS user_children (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);