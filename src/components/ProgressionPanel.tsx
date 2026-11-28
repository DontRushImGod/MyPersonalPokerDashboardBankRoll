import { useMemo } from 'react';
import {
  Trophy,
  Flame,
  Star,
  Zap,
  TrendingUp,
  Crown,
  Shield,
} from 'lucide-react';
import { PokerSession } from '../lib/supabase';
import { computeProgression } from '../lib/progression';

interface ProgressionPanelProps {
  sessions: PokerSession[];
}

function rankIcon(level: number) {
  if (level >= 40) return Crown;
  if (level >= 30) return Shield;
  if (level >= 20) return Trophy;
  if (level >= 12) return Zap;
  if (level >= 6) return Star;
  return TrendingUp;
}

function rankGradient(level: number): string {
  if (level >= 40) return 'from-amber-500 to-yellow-600';
  if (level >= 30) return 'from-emerald-500 to-teal-600';
  if (level >= 20) return 'from-blue-500 to-indigo-600';
  if (level >= 12) return 'from-orange-500 to-red-600';
  if (level >= 6) return 'from-sky-500 to-blue-600';
  return 'from-gray-400 to-gray-600';
}

export function ProgressionPanel({ sessions }: ProgressionPanelProps) {
  const state = useMemo(() => computeProgression(sessions), [sessions]);
  const RankIcon = rankIcon(state.level);
  const xpPct = state.xpForNext > 0 ? (state.xpInLevel / state.xpForNext) * 100 : 0;

  const stats = [
    { label: 'Poker Rating', value: state.pokerRating, icon: Trophy, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Total XP', value: state.xp.toLocaleString(), icon: Zap, color: 'text-amber-600 dark:text-amber-400' },
    { label: 'Current Streak', value: `${state.currentStreak}d`, icon: Flame, color: 'text-orange-600 dark:text-orange-400' },
    { label: 'Best Streak', value: `${state.bestStreak}d`, icon: Star, color: 'text-purple-600 dark:text-purple-400' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className={`bg-gradient-to-r ${rankGradient(state.level)} p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <RankIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-white/80 text-sm font-medium">Poker Rank</p>
              <h2 className="text-2xl font-bold text-white">{state.rankTitle}</h2>
              <p className="text-white/70 text-xs mt-0.5">Level {state.level} · {state.sessionsLogged} sessions</p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-white/80 text-xs font-medium uppercase tracking-wide">Rating</p>
            <p className="text-3xl font-bold text-white">{state.pokerRating}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Level {state.level} Progress
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {state.xpInLevel} / {state.xpForNext} XP
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(xpPct, 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </span>
                </div>
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
