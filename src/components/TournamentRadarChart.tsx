import { PokerSession } from '../lib/supabase';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend, ResponsiveContainer } from 'recharts';
import { Zap } from 'lucide-react';

interface TournamentRadarChartProps {
  sessions: PokerSession[];
}

export function TournamentRadarChart({ sessions }: TournamentRadarChartProps) {
  const pkoSessions = sessions.filter(s => s.game_type === 'PKO Tournament');
  const npkoSessions = sessions.filter(s => s.game_type === 'nPKO Tournament');

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const getMonthlyProfits = (tournamentSessions: PokerSession[]) => {
    const monthlyData: Record<number, number> = {};

    for (let i = 0; i < 12; i++) {
      monthlyData[i] = 0;
    }

    tournamentSessions.forEach(session => {
      const date = new Date(session.session_date);
      const month = date.getMonth();
      monthlyData[month] += parseFloat(session.profit.toString());
    });

    return monthlyData;
  };

  const pkoMonthlyProfits = getMonthlyProfits(pkoSessions);
  const npkoMonthlyProfits = getMonthlyProfits(npkoSessions);

  const allProfits = [...Object.values(pkoMonthlyProfits), ...Object.values(npkoMonthlyProfits)];
  const maxProfit = Math.max(...allProfits, 1);
  const minProfit = Math.min(...allProfits, -1);
  const range = maxProfit - minProfit;

  const normalizeProfit = (profit: number) => {
    return ((profit - minProfit) / range) * 100;
  };

  const data = monthNames.map((month, index) => ({
    month: month.slice(0, 3),
    PKO: normalizeProfit(pkoMonthlyProfits[index]),
    nPKO: normalizeProfit(npkoMonthlyProfits[index]),
  }));

  if (pkoSessions.length === 0 && npkoSessions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Monthly Tournament Performance</h3>
      </div>

      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid
              stroke="#1f2937"
              strokeWidth={2}
              radialLines={true}
            />
            <PolarAngleAxis
              dataKey="month"
              tick={{ fill: '#1f2937', fontSize: 12, fontWeight: 600 }}
              stroke="#1f2937"
              strokeWidth={1.5}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#1f2937', fontSize: 11, fontWeight: 500 }}
              stroke="#1f2937"
              strokeWidth={1.5}
            />
            <Radar
              name="PKO"
              dataKey="PKO"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.5}
              isAnimationActive
            />
            <Radar
              name="nPKO"
              dataKey="nPKO"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.5}
              isAnimationActive
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              verticalAlign="bottom"
              height={36}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">PKO Sessions</p>
          <p className="text-lg font-bold text-amber-700 dark:text-amber-400">{pkoSessions.length}</p>
        </div>
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">nPKO Sessions</p>
          <p className="text-lg font-bold text-blue-700 dark:text-blue-400">{npkoSessions.length}</p>
        </div>
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">PKO Profit</p>
          <p className={`text-lg font-bold ${pkoSessions.reduce((sum, s) => sum + parseFloat(s.profit.toString()), 0) >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
            ${pkoSessions.reduce((sum, s) => sum + parseFloat(s.profit.toString()), 0).toFixed(0)}
          </p>
        </div>
        <div className="text-center p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">nPKO Profit</p>
          <p className={`text-lg font-bold ${npkoSessions.reduce((sum, s) => sum + parseFloat(s.profit.toString()), 0) >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
            ${npkoSessions.reduce((sum, s) => sum + parseFloat(s.profit.toString()), 0).toFixed(0)}
          </p>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Sessions</p>
          <p className="text-lg font-bold text-gray-700 dark:text-gray-300">{pkoSessions.length + npkoSessions.length}</p>
        </div>
      </div>
    </div>
  );
}
