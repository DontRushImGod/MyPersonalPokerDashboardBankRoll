import { PokerSession } from '../lib/supabase';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

interface TournamentRadarChartProps {
  sessions: PokerSession[];
}

const COLORS = {
  PKO: '#f59e0b',
  nPKO: '#3b82f6',
};

export function TournamentRadarChart({ sessions }: TournamentRadarChartProps) {
  const pkoSessions = sessions.filter(s => s.game_type === 'PKO Tournament');
  const npkoSessions = sessions.filter(s => s.game_type === 'nPKO Tournament');

  const getDailyData = () => {
    const dailyData: Record<string, { PKO: number; nPKO: number }> = {};

    [...pkoSessions, ...npkoSessions].forEach(session => {
      const date = new Date(session.session_date);
      const dateKey = date.toISOString().split('T')[0];

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
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
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
        <div className="bg-gray-900 dark:bg-gray-950 text-white p-3 rounded-lg shadow-lg border border-gray-700">
          <p className="text-sm font-semibold">{payload[0].name}</p>
          <p className="text-lg font-bold" style={{ color: payload[0].payload.color }}>
            {payload[0].value} sessions
          </p>
          <p className="text-xs text-gray-400">
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
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <PieChartIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Daily Tournament Distribution</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="w-full h-80 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={120}
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
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-5 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-300">PKO Tournaments</h4>
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS.PKO }}></div>
            </div>
            <p className="text-3xl font-bold text-amber-700 dark:text-amber-400">{pkoSessions.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">sessions played</p>
            <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-800">
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Profit</p>
              <p className={`text-xl font-bold ${totalPKOProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                ${totalPKOProfit.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-5 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300">nPKO Tournaments</h4>
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS.nPKO }}></div>
            </div>
            <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">{npkoSessions.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">sessions played</p>
            <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Profit</p>
              <p className={`text-xl font-bold ${totalNPKOProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                ${totalNPKOProfit.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {dailyData.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Day-by-Day Breakdown</h4>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {dailyData.map((day, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="text-sm font-medium text-gray-900 dark:text-white">{day.date}</span>
                <div className="flex items-center gap-4">
                  {day.PKO > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.PKO }}></div>
                      <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">{day.PKO} PKO</span>
                    </div>
                  )}
                  {day.nPKO > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.nPKO }}></div>
                      <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">{day.nPKO} nPKO</span>
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
