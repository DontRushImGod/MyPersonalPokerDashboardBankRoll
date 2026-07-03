-- Drop the overly-permissive RLS policies that bypass row-level security.
DROP POLICY IF EXISTS "Allow public read access" ON poker_sessions;
DROP POLICY IF EXISTS "Allow public insert access" ON poker_sessions;
DROP POLICY IF EXISTS "Allow public update access" ON poker_sessions;
DROP POLICY IF EXISTS "Allow public delete access" ON poker_sessions;

-- Revoke all privileges from anon and authenticated so the table is not
-- accessible or discoverable via the GraphQL schema or REST API.
REVOKE ALL PRIVILEGES ON poker_sessions FROM anon, authenticated;

-- Keep RLS enabled so the table stays locked down even if privileges change.
ALTER TABLE poker_sessions ENABLE ROW LEVEL SECURITY;
