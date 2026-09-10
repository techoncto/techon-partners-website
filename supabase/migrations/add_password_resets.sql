-- Password reset tokens for client accounts
CREATE TABLE IF NOT EXISTS password_resets (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  client_id  uuid        NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  token      text        NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  used_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token);
