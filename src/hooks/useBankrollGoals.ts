import { useEffect, useState, useCallback } from 'react';
import { supabase, BankrollGoal, DEFAULT_GOALS } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

type GoalInput = Omit<BankrollGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export function useBankrollGoals(user: User | null) {
  const [goals, setGoals] = useState<BankrollGoal | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadGoals = useCallback(async () => {
    if (!user) {
      setGoals(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('bankroll_goals')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Error loading goals:', error);
        setGoals(null);
      } else if (data) {
        setGoals(data as BankrollGoal);
      } else {
        setGoals(null);
      }
    } catch (err) {
      console.error('Failed to load goals:', err);
      setGoals(null);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const saveGoals = useCallback(
    async (input: GoalInput): Promise<boolean> => {
      if (!user) return false;
      setSaving(true);
      try {
        const payload = {
          target_bankroll: input.target_bankroll,
          monthly_goal: input.monthly_goal,
          session_count_goal: input.session_count_goal,
          stop_loss: input.stop_loss,
          take_profit: input.take_profit,
          risk_per_session_pct: input.risk_per_session_pct,
          bankroll_warning: input.bankroll_warning,
          daily_loss_limit: input.daily_loss_limit,
          starting_bankroll: input.starting_bankroll,
          updated_at: new Date().toISOString(),
        };

        if (goals) {
          const { data, error } = await supabase
            .from('bankroll_goals')
            .update(payload)
            .eq('id', goals.id)
            .select()
            .single();

          if (error) throw error;
          if (data) setGoals(data as BankrollGoal);
        } else {
          const { data, error } = await supabase
            .from('bankroll_goals')
            .insert(payload)
            .select()
            .single();

          if (error) throw error;
          if (data) setGoals(data as BankrollGoal);
        }
        return true;
      } catch (err) {
        console.error('Error saving goals:', err);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [user, goals]
  );

  return {
    goals,
    loading,
    saving,
    saveGoals,
    refreshGoals: loadGoals,
  };
}

export { DEFAULT_GOALS };
