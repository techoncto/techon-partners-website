-- Migration: Track when a client first validates their invite code
-- Run this in the Supabase SQL Editor

ALTER TABLE invite_tokens
  ADD COLUMN IF NOT EXISTS initiated_at TIMESTAMPTZ;
