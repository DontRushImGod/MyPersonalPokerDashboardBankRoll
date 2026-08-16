-- Grant access only to authenticated users (not anon), so the table
-- is not publicly discoverable via GraphQL/REST.
GRANT SELECT, INSERT, UPDATE, DELETE ON poker_sessions TO authenticated;

-- Ownership-scoped policies: each signed-in user can only CRUD their own rows.
CREATE POLICY "select_own_poker_sessions" ON poker_sessions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "insert_own_poker_sessions" ON poker_sessions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "update_own_poker_sessions" ON poker_sessions
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete_own_poker_sessions" ON poker_sessions
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
