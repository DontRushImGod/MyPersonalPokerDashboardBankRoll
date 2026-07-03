import { useEffect, useState } from 'react';
import { PokerSession } from '../lib/supabase';

const STORAGE_KEY = 'poker_sessions_v1';

function loadSessions(): PokerSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveSessions(sessions: PokerSession[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.error('Error saving sessions:', err);
  }
}

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function usePokerSessions() {
  const [sessions, setSessions] = useState<PokerSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loaded = loadSessions().sort(
      (a, b) => new Date(b.session_date).getTime() - new Date(a.session_date).getTime()
    );
    setSessions(loaded);
    setLoading(false);
  }, []);

  const addSession = async (session: Omit<PokerSession, 'id' | 'profit' | 'created_at'>) => {
    try {
      const newSession: PokerSession = {
        ...session,
        id: createId(),
        profit: Number((session.cash_out - session.buy_in).toFixed(2)),
        created_at: new Date().toISOString(),
      };
      const updated = [newSession, ...sessions].sort(
        (a, b) => new Date(b.session_date).getTime() - new Date(a.session_date).getTime()
      );
      setSessions(updated);
      saveSessions(updated);
      return true;
    } catch (err) {
      console.error('Error adding session:', err);
      return false;
    }
  };

  const deleteSession = async (id: string) => {
    try {
      const updated = sessions.filter((s) => s.id !== id);
      setSessions(updated);
      saveSessions(updated);
      return true;
    } catch (err) {
      console.error('Error deleting session:', err);
      return false;
    }
  };

  const refreshSessions = async () => {
    const loaded = loadSessions().sort(
      (a, b) => new Date(b.session_date).getTime() - new Date(a.session_date).getTime()
    );
    setSessions(loaded);
  };

  return { sessions, loading, addSession, deleteSession, refreshSessions };
}
