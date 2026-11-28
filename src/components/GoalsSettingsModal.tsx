import { useState, useEffect } from 'react';
import { X, Loader2, Target, RotateCcw } from 'lucide-react';
import { BankrollGoal, DEFAULT_GOALS } from '../lib/supabase';

interface GoalsSettingsModalProps {
  goals: BankrollGoal | null;
  saving: boolean;
  onSave: (input: Omit<BankrollGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  onClose: () => void;
}

interface Field {
  key: keyof Omit<BankrollGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
  label: string;
  hint: string;
  step: string;
  isInteger?: boolean;
  prefix?: string;
  suffix?: string;
}

const FIELDS: Field[] = [
  { key: 'target_bankroll', label: 'Target Bankroll', hint: 'Your overall bankroll goal.', step: '100', prefix: '$' },
  { key: 'monthly_goal', label: 'Monthly Profit Goal', hint: 'How much profit you aim to make each month.', step: '50', prefix: '$' },
  { key: 'session_count_goal', label: 'Monthly Session Goal', hint: 'Target number of sessions per month.', step: '1', isInteger: true },
  { key: 'stop_loss', label: 'Stop-Loss per Session', hint: 'Stop playing for the session if you lose this much.', step: '10', prefix: '$' },
  { key: 'take_profit', label: 'Take-Profit per Session', hint: 'Walk away when you win this much in a session.', step: '10', prefix: '$' },
  { key: 'risk_per_session_pct', label: 'Risk per Session (%)', hint: 'Max % of your bankroll to risk on a single session.', step: '0.5', suffix: '%' },
  { key: 'bankroll_warning', label: 'Bankroll Warning Floor', hint: 'Get an alert when your bankroll drops below this.', step: '50', prefix: '$' },
  { key: 'daily_loss_limit', label: 'Daily Loss Limit', hint: 'Stop for the day if your total loss hits this.', step: '25', prefix: '$' },
  { key: 'starting_bankroll', label: 'Starting Bankroll', hint: 'Your baseline bankroll. Used to compute progress to your target.', step: '100', prefix: '$' },
];

type FormState = Omit<BankrollGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

function toForm(goals: BankrollGoal | null): FormState {
  if (!goals) return { ...DEFAULT_GOALS };
  return {
    target_bankroll: parseFloat(goals.target_bankroll.toString()),
    monthly_goal: parseFloat(goals.monthly_goal.toString()),
    session_count_goal: goals.session_count_goal,
    stop_loss: parseFloat(goals.stop_loss.toString()),
    take_profit: parseFloat(goals.take_profit.toString()),
    risk_per_session_pct: parseFloat(goals.risk_per_session_pct.toString()),
    bankroll_warning: parseFloat(goals.bankroll_warning.toString()),
    daily_loss_limit: parseFloat(goals.daily_loss_limit.toString()),
    starting_bankroll: parseFloat(goals.starting_bankroll.toString()),
  };
}

export function GoalsSettingsModal({ goals, saving, onSave, onClose }: GoalsSettingsModalProps) {
  const [form, setForm] = useState<FormState>(() => toForm(goals));
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(toForm(goals));
  }, [goals]);

  const update = (key: keyof FormState, value: number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setForm({ ...DEFAULT_GOALS });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const negatives = FIELDS.filter((f) => form[f.key] < 0);
    if (negatives.length > 0) {
      setError('Values cannot be negative.');
      return;
    }
    if (form.risk_per_session_pct > 100) {
      setError('Risk per session cannot exceed 100%.');
      return;
    }

    const ok = await onSave(form);
    if (ok) {
      onClose();
    } else {
      setError('Failed to save your goals. Please try again.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-[scaleIn_0.2s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Goals & Bankroll Rules
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Set targets and guardrails for your poker bankroll.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="overflow-y-auto px-6 py-5 space-y-5">
            {FIELDS.map((field) => (
              <div key={field.key} className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:items-center">
                <div className="sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {field.label}
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <div className="relative">
                    {field.prefix && (
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                        {field.prefix}
                      </span>
                    )}
                    <input
                      type="number"
                      step={field.step}
                      min="0"
                      required
                      value={form[field.key]}
                      onChange={(e) => {
                        const v = field.isInteger
                          ? parseInt(e.target.value, 10)
                          : parseFloat(e.target.value);
                        update(field.key, isNaN(v) ? 0 : v);
                      }}
                      className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        field.prefix ? 'pl-7' : ''
                      } ${field.suffix ? 'pr-8' : ''}`}
                    />
                    {field.suffix && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                        {field.suffix}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {field.hint}
                  </p>
                </div>
              </div>
            ))}

            {error && (
              <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={handleReset}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <div className="flex-1" />
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Goals'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
