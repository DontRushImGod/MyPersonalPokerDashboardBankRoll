import { useMemo } from 'react';
import { CheckCircle2, Circle, Calendar, CalendarDays, Zap } from 'lucide-react';
import { PokerSession } from '../lib/supabase';
import { computeProgression, type Challenge } from '../lib/progression';

interface ChallengesPanelProps {
  sessions: PokerSession[];
}

function ChallengeRow({ challenge }: { challenge: Challenge }) {
  const pct = challenge.target > 0 ? (challenge.progress / challenge.target) * 100 : 0;
  const isDaily = challenge.period === 'daily';
  const Icon = isDaily ? Calendar : CalendarDays;

  return (
    <div
      className={`rounded-lg p-4 border transition-all ${
        challenge.completed
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
          : 'bg-gray-50 dark:bg-gray-900/40 border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {challenge.completed ? (
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
          )}
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {challenge.title}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {challenge.description}
            </p>
          </div>
        </div>
        <span
          className={`text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1 px-2 py-1 rounded ${
            isDaily
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
              : 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
          }`}
        >
          <Icon className="w-3 h-3" />
          {challenge.period}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              challenge.completed ? 'bg-green-500' : isDaily ? 'bg-blue-500' : 'bg-purple-500'
            }`}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 flex-shrink-0">
          {challenge.progress} / {challenge.target} {challenge.unit}
        </span>
      </div>
    </div>
  );
}

export function ChallengesPanel({ sessions }: ChallengesPanelProps) {
  const state = useMemo(() => computeProgression(sessions), [sessions]);
  const daily = state.challenges.filter((c) => c.period === 'daily');
  const weekly = state.challenges.filter((c) => c.period === 'weekly');
  const completedCount = state.challenges.filter((c) => c.completed).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500 dark:text-amber-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Challenges</h3>
        </div>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {completedCount} / {state.challenges.length} done
        </span>
      </div>

      <div className="p-6 space-y-6">
        {daily.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Daily Challenges
            </p>
            <div className="space-y-2.5">
              {daily.map((c) => (
                <ChallengeRow key={c.id} challenge={c} />
              ))}
            </div>
          </div>
        )}
        {weekly.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-purple-600 dark:text-purple-400 mb-3 flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5" />
              Weekly Challenges
            </p>
            <div className="space-y-2.5">
              {weekly.map((c) => (
                <ChallengeRow key={c.id} challenge={c} />
              ))}
            </div>
          </div>
        )}
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          Challenges reset daily and weekly. Complete them to earn bonus XP and badges.
        </p>
      </div>
    </div>
  );
}
