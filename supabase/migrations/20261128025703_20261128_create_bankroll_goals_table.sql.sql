/*
# Create bankroll_goals table (multi-user, owner-scoped)

1. New Tables
   - `bankroll_goals`
     - `id` (uuid, primary key, default gen_random_uuid())
     - `user_id` (uuid, not null, default auth.uid(), references auth.users ON DELETE CASCADE)
     - `target_bankroll` (numeric, not null, default 10000) — overall bankroll goal
     - `monthly_goal` (numeric, not null, default 1000) — monthly profit target
     - `session_count_goal` (integer, not null, default 20) — target sessions per month
     - `stop_loss` (numeric, not null, default 100) — max loss per session before stopping
     - `take_profit` (numeric, not null, default 200) — target profit per session to walk away
     - `risk_per_session_pct` (numeric, not null, default 5) — max % of bankroll to risk per session
     - `bankroll_warning` (numeric, not null, default 500) — alert when bankroll drops below this
     - `daily_loss_limit` (numeric, not null, default 200) — max total loss allowed in a single day
     - `starting_bankroll` (numeric, not null, default 0) — user's initial bankroll baseline
     - `created_at` (timestamptz, default now())
     - `updated_at` (timestamptz, default now())
   - Unique constraint on `user_id` so each user has exactly one goals/rules row.

2. Security
   - Enable RLS on `bankroll_goals`.
   - Grant SELECT, INSERT, UPDATE, DELETE to `authenticated` only (app has sign-in).
   - Owner-scoped CRUD: each authenticated user can only access their own row.
   - `user_id` defaults to `auth.uid()` so inserts that omit it still pass the WITH CHECK.

3. Important Notes
   - This is a singleton-per-user settings table; the unique constraint on
     `user_id` guarantees one row per user.
   - The `updated_at` column has no trigger; the client updates it explicitly
     on save. This keeps the migration self-contained without extra triggers.
   - The migration is idempotent: CREATE TABLE IF NOT EXISTS and DROP POLICY
     IF EXISTS before each CREATE POLICY.
*/

CREATE TABLE IF NOT EXISTS bankroll_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  target_bankroll numeric NOT NULL DEFAULT 10000,
  monthly_goal numeric NOT NULL DEFAULT 1000,
  session_count_goal integer NOT NULL DEFAULT 20,
  stop_loss numeric NOT NULL DEFAULT 100,
  take_profit numeric NOT NULL DEFAULT 200,
  risk_per_session_pct numeric NOT NULL DEFAULT 5,
  bankroll_warning numeric NOT NULL DEFAULT 500,
  daily_loss_limit numeric NOT NULL DEFAULT 200,
  starting_bankroll numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT bankroll_goals_user_id_key UNIQUE (user_id)
);

ALTER TABLE bankroll_goals ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON bankroll_goals TO authenticated;

DROP POLICY IF EXISTS "select_own_goals" ON bankroll_goals;
CREATE POLICY "select_own_goals"
  ON bankroll_goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_goals" ON bankroll_goals;
CREATE POLICY "insert_own_goals"
  ON bankroll_goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_goals" ON bankroll_goals;
CREATE POLICY "update_own_goals"
  ON bankroll_goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_goals" ON bankroll_goals;
CREATE POLICY "delete_own_goals"
  ON bankroll_goals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
