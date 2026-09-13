/*
# Fix user_id column: add DEFAULT auth.uid() and NOT NULL

## Problem
The user_id column was created as nullable with no default. Every insert
from the frontend omitted user_id (relying on a database default that didn't
exist), so all 47 existing rows have user_id = NULL. The RLS policy
checks auth.uid() = user_id, which always fails when user_id is NULL,
making it impossible for authenticated users to insert new sessions.

## Changes
1. Backfill: assign all 47 existing NULL rows to the first user
   (vasco_portuga@hotmail.com, id 33e6fae5-66f5-4aca-97fa-7ac3315d7886)
   who was the original account and likely created these sessions.
2. Set the column to NOT NULL DEFAULT auth.uid() so future inserts
   automatically fill user_id from the authenticated session.
3. Add the foreign key constraint to auth.users(id) with ON DELETE CASCADE.

## Security
- No policy changes needed — existing ownership-scoped policies are correct.
- The DEFAULT auth.uid() is what makes .insert() work without the client
  passing user_id explicitly.
*/

-- Step 1: Backfill existing NULL rows to the first user
UPDATE poker_sessions
SET user_id = '33e6fae5-66f5-4aca-97fa-7ac3315d7886'
WHERE user_id IS NULL;

-- Step 2: Set the column to NOT NULL with DEFAULT auth.uid()
ALTER TABLE poker_sessions
  ALTER COLUMN user_id SET DEFAULT auth.uid();

ALTER TABLE poker_sessions
  ALTER COLUMN user_id SET NOT NULL;

-- Step 3: Add foreign key constraint (drop first if exists for idempotency)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'poker_sessions'
      AND constraint_name = 'poker_sessions_user_id_fkey'
  ) THEN
    ALTER TABLE poker_sessions
      ADD CONSTRAINT poker_sessions_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Step 4: Add index for faster user-scoped queries
CREATE INDEX IF NOT EXISTS idx_poker_sessions_user_id
  ON poker_sessions(user_id);
