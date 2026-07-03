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
