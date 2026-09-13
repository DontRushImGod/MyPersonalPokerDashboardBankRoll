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