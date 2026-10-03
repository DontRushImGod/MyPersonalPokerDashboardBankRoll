import { PokerSession } from '../lib/supabase';
import { TrendingUp, Wallet, Calendar, BarChart3, Target } from 'lucide-react';

interface StatisticsProps {
  sessions: PokerSession[];
  bankrollGoal?: number;
}

export function Statistics({ sessions, bankrollGoal = 10000 }: StatisticsProps) {
  const totalBuyIn = sessions.reduce((sum, s) => sum + parseFloat(s.buy_in.toString()), 0);
  const totalCashOut = sessions.reduce((sum, s) => sum + parseFloat(s.cash_out.toString()), 0);
  const currentBankroll = totalCashOut - totalBuyIn;
  const totalSessions = sessions.length;
  const averageProfit = totalSessions > 0 ? currentBankroll / totalSessions : 0;
  const winRate = totalBuyIn > 0 ? ((currentBankroll / totalBuyIn) * 100) : 0;
  const goalProgress = bankrollGoal > 0 ? (currentBankroll / bankrollGoal) * 100 : 0;

  const stats = [
    {
      label: 'Current Bankroll',
      value: `$${currentBankroll.toFixed(2)}`,
      icon: Wallet,
      color: currentBankroll >= 0 ? 'text-felt-600 dark:text-felt-400' : 'text-red-500',
      bgColor: currentBankroll >= 0 ? 'bg-felt-50 dark:bg-felt-900/20 border-felt-200 dark:border-felt-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    },
    {
      label: 'Win Rate',
      value: `${winRate.toFixed(2)}%`,
      icon: TrendingUp,
      color: winRate >= 0 ? 'text-felt-600 dark:text-felt-400' : 'text-red-500',
      bgColor: winRate >= 0 ? 'bg-felt-50 dark:bg-felt-900/20 border-felt-200 dark:border-felt-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    },
    {
      label: 'Avg. Profit/Session',
      value: `$${averageProfit.toFixed(2)}`,
      icon: BarChart3,
      color: averageProfit >= 0 ? 'text-accent-600 dark:text-accent-400' : 'text-red-500',
      bgColor: averageProfit >= 0 ? 'bg-accent-50 dark:bg-accent-900/20 border-accent-200 dark:border-accent-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    },
    {
      label: 'Total Sessions',
      value: totalSessions.toString(),
      icon: Calendar,
      color: 'text-ink-600 dark:text-ink-300',
      bgColor: 'bg-ink-50 dark:bg-ink-800/50 border-ink-200 dark:border-ink-700',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bgColor} rounded-xl p-5 border transition-all hover:shadow-felt`}
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <p className="text-xs font-medium text-ink-500 dark:text-ink-400 mb-1 uppercase tracking-wide">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-ink-900 rounded-xl p-5 border border-ink-200 dark:border-ink-800">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-accent-500" />
          <h3 className="text-base font-semibold text-ink-900 dark:text-white">Bankroll Goal Progress</h3>
          <span className="ml-auto text-sm font-medium text-ink-500 dark:text-ink-400 font-mono">
            ${currentBankroll.toFixed(2)} / ${bankrollGoal.toFixed(2)}
          </span>
        </div>
        <div className="w-full bg-ink-200 dark:bg-ink-800 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-700 rounded-full ${
              goalProgress >= 100 ? 'bg-felt-500' : goalProgress >= 75 ? 'bg-felt-500' : goalProgress >= 50 ? 'bg-accent-500' : 'bg-orange-500'
            }`}
            style={{ width: `${Math.min(Math.max(goalProgress, 0), 100)}%` }}
          />
        </div>
        <p className="text-right text-sm text-ink-500 dark:text-ink-400 mt-2">
          {goalProgress.toFixed(1)}% complete
        </p>
      </div>
    </div>
  );
}
