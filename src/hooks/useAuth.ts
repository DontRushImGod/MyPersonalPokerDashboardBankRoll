import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let settled = false;

    const finish = (u: User | null) => {
      if (settled || !mounted) return;
      settled = true;
      setUser(u);
      setLoading(false);
    };

    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (error) console.error('Session error:', error.message);
        finish(session?.user ?? null);
      })
      .catch((err) => {
        console.error('Failed to get session:', err);
        finish(null);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      finish(session?.user ?? null);
    });

    const timeout = setTimeout(() => finish(null), 3000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
