/*
  # Fix RLS Policies for Public Access

  This migration updates the RLS policies to allow public access to the poker_sessions table.
  Since this is a personal bankroll tracker without authentication, we're enabling public access.

  ## Changes
  - Drop existing restrictive authenticated-only policies
  - Create new public access policies for SELECT, INSERT, UPDATE, and DELETE operations
  - Remove the user_id requirement since there's no authentication system

  ## Security Notes
  - This makes the data publicly accessible
  - Suitable for personal use or demo purposes
  - For production with multiple users, authentication should be implemented
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can read own sessions" ON poker_sessions;
DROP POLICY IF EXISTS "Authenticated users can insert sessions" ON poker_sessions;
DROP POLICY IF EXISTS "Authenticated users can update own sessions" ON poker_sessions;
DROP POLICY IF EXISTS "Authenticated users can delete own sessions" ON poker_sessions;

-- Create public access policies
CREATE POLICY "Allow public read access"
  ON poker_sessions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access"
  ON poker_sessions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON poker_sessions
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access"
  ON poker_sessions
  FOR DELETE
  TO public
  USING (true);
