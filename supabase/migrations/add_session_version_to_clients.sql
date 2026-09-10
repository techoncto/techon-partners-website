-- Adds session_version to clients so JWTs can be invalidated on password reset.
-- Incrementing this column makes all previously issued tokens for that client stale.

alter table clients
  add column if not exists session_version int not null default 1;
