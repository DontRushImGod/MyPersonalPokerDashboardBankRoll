import { PokerSession } from '../lib/supabase';
import { Globe } from 'lucide-react';

interface SiteDistributionProps {
  sessions: PokerSession[];
}

const SITE_COLORS: Record<string, string> = {
  GGPoker: 'bg-orange-500',
  PokerStars: 'bg-red-500',
  CoinPoker: 'bg-sky-500',
  WPTGlobal: 'bg-felt-500',
  ClubGG: 'bg-amber-500',
  Other: 'bg-ink-400',
};

export function SiteDistribution({ sessions }: SiteDistributionProps) {
  const siteStats = sessions.reduce((acc, session) => {
    const site = session.location;
    if (!acc[site]) {
      acc[site] = {
        totalBuyIn: 0,
        sessions: 0,
        profit: 0,
      };
    }
    acc[site].totalBuyIn += parseFloat(session.buy_in.toString());
    acc[site].sessions += 1;
    acc[site].profit += parseFloat(session.profit.toString());
    return acc;
  }, {} as Record<string, { totalBuyIn: number; sessions: number; profit: number }>);

  const sortedSites = Object.entries(siteStats).sort((a, b) => b[1].totalBuyIn - a[1].totalBuyIn);
  const totalBuyIn = Object.values(siteStats).reduce((sum, stat) => sum + stat.totalBuyIn, 0);

  if (sessions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-ink-900 rounded-xl p-6 border border-ink-200 dark:border-ink-800">
      <div className="flex items-center gap-2 mb-6">
        <Globe className="w-5 h-5 text-felt-600 dark:text-felt-400" />
        <h3 className="text-lg font-bold text-ink-900 dark:text-white">Distribution by Site</h3>
      </div>

      <div className="space-y-4">
        {sortedSites.map(([site, stats]) => {
          const percentage = totalBuyIn > 0 ? (stats.totalBuyIn / totalBuyIn) * 100 : 0;
          const color = SITE_COLORS[site] || SITE_COLORS.Other;

          return (
            <div key={site} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${color}`} />
                  <span className="font-medium text-ink-900 dark:text-white">{site}</span>
                </div>
                <div className="flex items-center gap-4 text-ink-500 dark:text-ink-400">
                  <span>{stats.sessions} sessions</span>
                  <span className="font-semibold font-mono">${stats.totalBuyIn.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-ink-200 dark:bg-ink-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${color} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-ink-500 dark:text-ink-400 w-12 text-right">
                  {percentage.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-end">
                <span className={`text-sm font-semibold font-mono ${stats.profit >= 0 ? 'text-felt-600 dark:text-felt-400' : 'text-red-500'}`}>
                  {stats.profit >= 0 ? '+' : ''}${stats.profit.toFixed(2)} profit
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-ink-200 dark:border-ink-800">
        <div className="flex justify-between text-sm">
          <span className="font-semibold text-ink-900 dark:text-white">Total Investment</span>
          <span className="font-bold text-ink-900 dark:text-white font-mono">${totalBuyIn.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
