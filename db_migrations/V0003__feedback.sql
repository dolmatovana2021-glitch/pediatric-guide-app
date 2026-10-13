CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  category VARCHAR(32) NOT NULL DEFAULT 'idea',
  message TEXT NOT NULL,
  contact VARCHAR(200),
  app_version VARCHAR(40),
  user_agent VARCHAR(300),
  ip VARCHAR(64),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS feedback_created_idx ON feedback (created_at DESC);
CREATE INDEX IF NOT EXISTS feedback_ip_idx ON feedback (ip, created_at);