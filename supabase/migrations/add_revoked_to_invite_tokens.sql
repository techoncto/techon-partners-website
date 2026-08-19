alter table invite_tokens
  add column if not exists revoked_at timestamptz,
  add column if not exists revoked    boolean not null default false;
