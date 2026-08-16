import { useEffect, useState, useCallback } from 'react';
import { supabase, PokerSession } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export function usePokerSessions(user: User | null) {
  const [sessions, setSessions] = useState<PokerSession[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSessions = useCallback(async () => {
    if (!user) {
      setSessions([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('poker_sessions')
      .select('*')
      .order('session_date', { ascending: false });

    if (error) {
      console.error('Error loading sessions:', error);
      setSessions([]);
    } else {
      setSessions(data ?? []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const addSession = async (session: Omit<PokerSession, 'id' | 'user_id' | 'profit' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('poker_sessions')
        .insert({
          buy_in: session.buy_in,
          cash_out: session.cash_out,
          game_type: session.game_type,
          stakes: session.stakes,
          duration: session.duration,
          location: session.location,
          notes: session.notes,
          session_date: session.session_date,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setSessions(prev =>
          [data as PokerSession, ...prev].sort(
            (a, b) => new Date(b.session_date).getTime() - new Date(a.session_date).getTime()
          )
        );
      }
      return true;
    } catch (err) {
      console.error('Error adding session:', err);
      return false;
    }
  };

  const deleteSession = async (id: string) => {
    try {
      const { error } = await supabase
        .from('poker_sessions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSessions(prev => prev.filter(s => s.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting session:', err);
      return false;
    }
  };

  return { sessions, loading, addSession, deleteSession, refreshSessions: loadSessions };
}
