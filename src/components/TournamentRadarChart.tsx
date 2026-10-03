import { PokerSession } from '../lib/supabase';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

interface TournamentRadarChartProps {
  sessions: PokerSession[];
}

const COLORS = {
  PKO: '#d97706',
  nPKO: '#2d8e75',
};

export function TournamentRadarChart({ sessions }: TournamentRadarChartProps) {
  const pkoSessions = sessions.filter(s => s.game_type === 'PKO Tournament');
  const npkoSessions = sessions.filter(s => s.game_type === 'nPKO Tournament');

  const getDailyData = () => {
    const dailyData: Record<string, { PKO: number; nPKO: number }> = {};

    [...pkoSessions, ...npkoSessions].forEach(session => {
      const date = new Date(session.session_date);
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      if (!dailyData[dateKey]) {
        dailyData[dateKey] = { PKO: 0, nPKO: 0 };
      }

      if (session.game_type === 'PKO Tournament') {
        dailyData[dateKey].PKO += 1;
      } else {
        dailyData[dateKey].nPKO += 1;
      }
    });

    return Object.entries(dailyData)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, counts]) => ({
        date: new Date(date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: date,
        PKO: counts.PKO,
        nPKO: counts.nPKO,
      }));
  };

  const pieData = [
    { name: 'PKO Tournaments', value: pkoSessions.length, color: COLORS.PKO },
    { name: 'nPKO Tournaments', value: npkoSessions.length, color: COLORS.nPKO },
  ];

  const dailyData = getDailyData();
  const totalPKOProfit = pkoSessions.reduce((sum, s) => sum + parseFloat(s.profit.toString()), 0);
  const totalNPKOProfit = npkoSessions.reduce((sum, s) => sum + parseFloat(s.profit.toString()), 0);

  if (pkoSessions.length === 0 && npkoSessions.length === 0) {
    return null;
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-ink-900 dark:bg-ink-950 text-white p-3 rounded-lg shadow-felt-lg border border-ink-700">
          <p className="text-sm font-semibold">{payload[0].name}</p>
          <p className="text-lg font-bold" style={{ color: payload[0].payload.color }}>
            {payload[0].value} sessions
          </p>
          <p className="text-xs text-ink-400">
            {((payload[0].value / (pkoSessions.length + npkoSessions.length)) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="font-bold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white dark:bg-ink-900 rounded-xl p-6 border border-ink-200 dark:border-ink-800">
      <div className="flex items-center gap-2 mb-6">
        <PieChartIcon className="w-5 h-5 text-accent-600 dark:text-accent-400" />
        <h3 className="text-lg font-bold text-ink-900 dark:text-white">Tournament Distribution</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="w-full h-72 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={110}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-br from-accent-50 to-orange-50 dark:from-accent-900/20 dark:to-orange-900/10 rounded-xl p-5 border border-accent-200 dark:border-accent-800">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-accent-800 dark:text-accent-300">PKO Tournaments</h4>
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS.PKO }}></div>
            </div>
            <p className="text-3xl font-bold text-accent-700 dark:text-accent-400">{pkoSessions.length}</p>
            <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">sessions played</p>
            <div className="mt-3 pt-3 border-t border-accent-200 dark:border-accent-800">
              <p className="text-xs text-ink-500 dark:text-ink-400">Total Profit</p>
              <p className={`text-xl font-bold font-mono ${totalPKOProfit >= 0 ? 'text-felt-600 dark:text-felt-400' : 'text-red-500'}`}>
                ${totalPKOProfit.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-felt-50 to-emerald-50 dark:from-felt-900/20 dark:to-emerald-900/10 rounded-xl p-5 border border-felt-200 dark:border-felt-800">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-felt-800 dark:text-felt-300">nPKO Tournaments</h4>
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS.nPKO }}></div>
            </div>
            <p className="text-3xl font-bold text-felt-700 dark:text-felt-400">{npkoSessions.length}</p>
            <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">sessions played</p>
            <div className="mt-3 pt-3 border-t border-felt-200 dark:border-felt-800">
              <p className="text-xs text-ink-500 dark:text-ink-400">Total Profit</p>
              <p className={`text-xl font-bold font-mono ${totalNPKOProfit >= 0 ? 'text-felt-600 dark:text-felt-400' : 'text-red-500'}`}>
                ${totalNPKOProfit.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {dailyData.length > 0 && (
        <div className="mt-6 pt-6 border-t border-ink-200 dark:border-ink-800">
          <h4 className="text-sm font-semibold text-ink-900 dark:text-white mb-4">Day-by-Day Breakdown</h4>
          <div className="max-h-64 overflow-y-auto scrollbar-thin space-y-2">
            {dailyData.map((day, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-ink-50 dark:bg-ink-800/50 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
              >
                <span className="text-sm font-medium text-ink-900 dark:text-white">{day.date}</span>
                <div className="flex items-center gap-4">
                  {day.PKO > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.PKO }}></div>
                      <span className="text-sm font-semibold text-accent-700 dark:text-accent-400">{day.PKO} PKO</span>
                    </div>
                  )}
                  {day.nPKO > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.nPKO }}></div>
                      <span className="text-sm font-semibold text-felt-700 dark:text-felt-400">{day.nPKO} nPKO</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
