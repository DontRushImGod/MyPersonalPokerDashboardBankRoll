/*
  # Fix Critical Security Issues

  1. RLS Policy Security
    - Remove overly permissive "Allow public" policies that allow unrestricted access
    - Replace with authenticated-only policies that enforce user ownership
    - All operations (SELECT, INSERT, UPDATE, DELETE) now require authentication

  2. Unused Indexes
    - Drop unused indexes: `idx_poker_sessions_game_type` and `idx_poker_sessions_location`
    - Keep only the essential date index for query optimization

  3. Auth Connection Strategy
    - Connection pooling strategy will be adjusted through Supabase dashboard settings
    - This requires switching to percentage-based allocation (manual configuration recommended)

  4. Security Implementation
    - Users can only read their own records
    - Users can only insert records (creates with their own user_id)
    - Users can only update/delete their own records
    - Add user_id column to track record ownership
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'poker_sessions' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE poker_sessions ADD COLUMN user_id uuid;
  END IF;
END $$;

DROP POLICY IF EXISTS "Allow public read access" ON poker_sessions;
DROP POLICY IF EXISTS "Allow public insert access" ON poker_sessions;
DROP POLICY IF EXISTS "Allow public update access" ON poker_sessions;
DROP POLICY IF EXISTS "Allow public delete access" ON poker_sessions;

DROP INDEX IF EXISTS idx_poker_sessions_game_type;
DROP INDEX IF EXISTS idx_poker_sessions_location;

CREATE POLICY "Authenticated users can read own sessions"
  ON poker_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert sessions"
  ON poker_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update own sessions"
  ON poker_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete own sessions"
  ON poker_sessions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
