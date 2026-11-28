import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    lock: async (_name, _acquireTimeout, fn) => fn(),
  },
});

export interface PokerSession {
  id: string;
  user_id: string;
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

export interface BankrollGoal {
  id: string;
  user_id: string;
  target_bankroll: number;
  monthly_goal: number;
  session_count_goal: number;
  stop_loss: number;
  take_profit: number;
  risk_per_session_pct: number;
  bankroll_warning: number;
  daily_loss_limit: number;
  starting_bankroll: number;
  created_at: string;
  updated_at: string;
}

export const DEFAULT_GOALS: Omit<BankrollGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
  target_bankroll: 10000,
  monthly_goal: 1000,
  session_count_goal: 20,
  stop_loss: 100,
  take_profit: 200,
  risk_per_session_pct: 5,
  bankroll_warning: 500,
  daily_loss_limit: 200,
  starting_bankroll: 0,
};
