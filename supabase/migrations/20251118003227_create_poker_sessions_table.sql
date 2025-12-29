/*
  # Create Poker Sessions Table

  1. New Tables
    - `poker_sessions`
      - `id` (uuid, primary key)
      - `buy_in` (decimal) - Amount invested in the session
      - `cash_out` (decimal) - Amount cashed out
      - `profit` (decimal, generated) - Calculated profit/loss
      - `game_type` (text) - Type of game (Cash Game, PKO Tournament, nPKO Tournament, etc.)
      - `stakes` (text) - Stakes level
      - `duration` (integer) - Session duration in minutes
      - `location` (text) - Site/location where played (GGPoker, PokerStars, etc.)
      - `notes` (text) - Optional notes about the session
      - `session_date` (timestamptz) - When the session occurred
      - `created_at` (timestamptz) - When record was created

  2. Security
    - Enable RLS on `poker_sessions` table
    - Add policies for public access (simplified for demo)
*/

CREATE TABLE IF NOT EXISTS poker_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buy_in decimal(10,2) NOT NULL,
  cash_out decimal(10,2) NOT NULL,
  profit decimal(10,2) GENERATED ALWAYS AS (cash_out - buy_in) STORED,
  game_type text NOT NULL,
  stakes text NOT NULL,
  duration integer NOT NULL,
  location text NOT NULL,
  notes text DEFAULT '',
  session_date timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE poker_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access"
  ON poker_sessions
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access"
  ON poker_sessions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON poker_sessions
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access"
  ON poker_sessions
  FOR DELETE
  USING (true);

CREATE INDEX IF NOT EXISTS idx_poker_sessions_date ON poker_sessions(session_date DESC);
CREATE INDEX IF NOT EXISTS idx_poker_sessions_game_type ON poker_sessions(game_type);
CREATE INDEX IF NOT EXISTS idx_poker_sessions_location ON poker_sessions(location);