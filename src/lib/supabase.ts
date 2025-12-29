import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface PokerSession {
  id: string;
  buy_in: number;
  cash_out: number;
  profit: number;
  game_type: string;
  stakes: string;
  duration: number;
  location: string;
  notes: string;
  session_date: string;
  created_at: string;
}
