import { PokerSession } from '../lib/supabase';
import { TrendingUp, DollarSign, Clock, BarChart3 } from 'lucide-react';

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
      icon: DollarSign,
      color: currentBankroll >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
      bgColor: currentBankroll >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20',
    },
    {
      label: 'Win Rate',
      value: `${winRate.toFixed(2)}%`,
      icon: TrendingUp,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Avg. Profit/Session',
      value: `$${averageProfit.toFixed(2)}`,
      icon: BarChart3,
      color: averageProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
      bgColor: averageProfit >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20',
    },
    {
      label: 'Total Sessions',
      value: totalSessions.toString(),
      icon: Clock,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bgColor} rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className={`text-2xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bankroll Goal Progress</h3>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            ${currentBankroll.toFixed(2)} / ${bankrollGoal.toFixed(2)}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              goalProgress >= 100 ? 'bg-green-500' : goalProgress >= 75 ? 'bg-blue-500' : goalProgress >= 50 ? 'bg-yellow-500' : 'bg-orange-500'
            }`}
            style={{ width: `${Math.min(goalProgress, 100)}%` }}
          />
        </div>
        <p className="text-right text-sm text-gray-600 dark:text-gray-400 mt-2">
          {goalProgress.toFixed(1)}% complete
        </p>
      </div>
    </div>
  );
}
