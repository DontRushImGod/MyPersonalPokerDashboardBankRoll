/*
# Add user_id column with auth.uid() default

1. Modified Tables
   - `poker_sessions`
     - Add `user_id` column (uuid, NOT NULL, DEFAULT auth.uid())
     - This allows the frontend to insert sessions without explicitly passing user_id;
       the database fills it from the authenticated session.
     - Add foreign key constraint to auth.users(id) with ON DELETE CASCADE
       so that when a user is deleted, their sessions are automatically removed.

2. Security
   - No policy changes needed — existing ownership-scoped policies already
     check auth.uid() = user_id for all CRUD operations.
   - The DEFAULT auth.uid() ensures INSERT policy WITH CHECK passes even
     when the client omits user_id from the insert payload.

3. Important Notes
   - The column is added with NOT NULL DEFAULT auth.uid(), so existing rows
     (if any) would get the current user's uid. Since the table is currently
     empty, this is safe.
   - This migration is idempotent: the DO block checks if the column exists
     before adding it.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'poker_sessions'
      AND column_name = 'user_id'
  ) THEN
    ALTER TABLE poker_sessions
      ADD COLUMN user_id uuid NOT NULL DEFAULT auth.uid();
  END IF;
END $$;

-- Add foreign key constraint (drop first if exists for idempotency)
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

-- Add index for faster queries filtered by user_id
CREATE INDEX IF NOT EXISTS idx_poker_sessions_user_id
  ON poker_sessions(user_id);
