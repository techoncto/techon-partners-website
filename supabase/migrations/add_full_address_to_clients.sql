-- Migration: Split address into individual fields on clients table
-- Run this in the Supabase SQL Editor

ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS address2  TEXT,
  ADD COLUMN IF NOT EXISTS city      TEXT,
  ADD COLUMN IF NOT EXISTS state     TEXT,
  ADD COLUMN IF NOT EXISTS zip       TEXT,
  ADD COLUMN IF NOT EXISTS country   TEXT NOT NULL DEFAULT 'US';
