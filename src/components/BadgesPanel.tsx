import { useMemo } from 'react';
import {
  Footprints, Sparkles, Dumbbell, Medal, Trophy, Flame, Zap, Coins,
  Gem, TrendingUp, Crown, Moon, Calendar, Clock, Layers, Shapes,
  Target, Rocket, Lock, Award,
} from 'lucide-react';
import { PokerSession } from '../lib/supabase';
import { computeProgression, type Rarity, type Badge } from '../lib/progression';

interface BadgesPanelProps {
  sessions: PokerSession[];
}

const ICONS: Record<string, typeof Trophy> = {
  Footprints, Sparkles, Dumbbell, Medal, Trophy, Flame, Zap, Coins,
  Gem, TrendingUp, Crown, Moon, Calendar, Clock, Layers, Shapes,
  Target, Rocket,
};

const RARITY_STYLES: Record<Rarity, { unlocked: string; locked: string; ring: string; label: string }> = {
  common: {
    unlocked: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    locked: 'bg-gray-50 dark:bg-gray-800/50 text-gray-300 dark:text-gray-600',
    ring: 'border-gray-200 dark:border-gray-700',
    label: 'text-gray-500 dark:text-gray-400',
  },
  rare: {
    unlocked: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    locked: 'bg-gray-50 dark:bg-gray-800/50 text-gray-300 dark:text-gray-600',
    ring: 'border-blue-200 dark:border-blue-800',
    label: 'text-blue-500 dark:text-blue-400',
  },
  epic: {
    unlocked: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    locked: 'bg-gray-50 dark:bg-gray-800/50 text-gray-300 dark:text-gray-600',
    ring: 'border-purple-200 dark:border-purple-800',
    label: 'text-purple-500 dark:text-purple-400',
  },
  legendary: {
    unlocked: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    locked: 'bg-gray-50 dark:bg-gray-800/50 text-gray-300 dark:text-gray-600',
    ring: 'border-amber-200 dark:border-amber-800',
    label: 'text-amber-500 dark:text-amber-400',
  },
};

function BadgeCard({ badge }: { badge: Badge }) {
  const Icon = ICONS[badge.icon] ?? Award;
  const styles = RARITY_STYLES[badge.rarity];
  return (
    <div
      className={`relative rounded-lg border p-4 transition-all hover:shadow-md ${
        badge.unlocked
          ? `${styles.unlocked} ${styles.ring}`
          : `${styles.locked} border-gray-200 dark:border-gray-800`
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            badge.unlocked ? styles.unlocked : 'bg-gray-100 dark:bg-gray-800'
          }`}
        >
          {badge.unlocked ? (
            <Icon className="w-5 h-5" />
          ) : (
            <Lock className="w-4 h-4 text-gray-400 dark:text-gray-600" />
          )}
        </div>
        <span className={`text-[10px] font-semibold uppercase tracking-wide ${styles.label}`}>
          {badge.rarity}
        </span>
      </div>
      <p className={`text-sm font-semibold ${badge.unlocked ? '' : 'text-gray-400 dark:text-gray-600'}`}>
        {badge.name}
      </p>
      <p className={`text-xs mt-1 ${badge.unlocked ? 'opacity-80' : 'text-gray-400 dark:text-gray-600'}`}>
        {badge.description}
      </p>
    </div>
  );
}

export function BadgesPanel({ sessions }: BadgesPanelProps) {
  const state = useMemo(() => computeProgression(sessions), [sessions]);
  const unlocked = state.badges.filter((b) => b.unlocked);
  const locked = state.badges.filter((b) => !b.unlocked);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500 dark:text-amber-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Achievements</h3>
        </div>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {state.badgesUnlocked} / {state.badgesTotal} unlocked
        </span>
      </div>

      <div className="p-6">
        {state.badgesTotal === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-6">
            Log sessions to start earning badges.
          </p>
        ) : (
          <>
            {unlocked.length > 0 && (
              <>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
                  Unlocked
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                  {unlocked.map((b) => (
                    <BadgeCard key={b.id} badge={b} />
                  ))}
                </div>
              </>
            )}
            {locked.length > 0 && (
              <>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
                  Locked
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {locked.map((b) => (
                    <BadgeCard key={b.id} badge={b} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
