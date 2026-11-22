CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  title       VARCHAR(150) NOT NULL,
  description TEXT,
  status      VARCHAR(20)  NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'in_progress', 'done')),
  due_date    DATE,
  created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks (user_id);
