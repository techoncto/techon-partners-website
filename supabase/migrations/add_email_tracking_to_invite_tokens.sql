-- Migration: Add email tracking columns to invite_tokens
-- Run this in the Supabase SQL Editor

ALTER TABLE invite_tokens
  ADD COLUMN IF NOT EXISTS email_sent_at   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS resend_email_id TEXT;
