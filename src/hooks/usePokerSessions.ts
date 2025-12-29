import { useEffect, useState } from 'react';
import { supabase, PokerSession } from '../lib/supabase';

export function usePokerSessions() {
  const [sessions, setSessions] = useState<PokerSession[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('poker_sessions')
      .select('*')
      .order('session_date', { ascending: false });

    if (error) {
      console.error('Error fetching sessions:', error);
    } else {
      setSessions(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const addSession = async (session: Omit<PokerSession, 'id' | 'profit' | 'created_at'>) => {
    const { error } = await supabase
      .from('poker_sessions')
      .insert([session]);

    if (error) {
      console.error('Error adding session:', error);
      return false;
    }

    await fetchSessions();
    return true;
  };

  const deleteSession = async (id: string) => {
    const { error } = await supabase
      .from('poker_sessions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting session:', error);
      return false;
    }

    await fetchSessions();
    return true;
  };

  return { sessions, loading, addSession, deleteSession, refreshSessions: fetchSessions };
}
