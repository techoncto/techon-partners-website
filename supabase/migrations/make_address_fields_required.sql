-- Migration: Make city, state, zip NOT NULL on clients table
-- Run this in the Supabase SQL Editor

-- Fill any existing NULL values before adding the constraint
UPDATE clients SET city  = '' WHERE city  IS NULL;
UPDATE clients SET state = '' WHERE state IS NULL;
UPDATE clients SET zip   = '' WHERE zip   IS NULL;

-- Apply NOT NULL constraints
ALTER TABLE clients
  ALTER COLUMN city  SET NOT NULL,
  ALTER COLUMN state SET NOT NULL,
  ALTER COLUMN zip   SET NOT NULL;
