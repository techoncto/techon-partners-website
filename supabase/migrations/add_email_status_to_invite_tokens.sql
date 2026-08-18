-- Migration: Add email_status column to invite_tokens
-- Run this in the Supabase SQL Editor

ALTER TABLE invite_tokens
  ADD COLUMN IF NOT EXISTS email_status TEXT NOT NULL DEFAULT 'not_sent';
