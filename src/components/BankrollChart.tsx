import { useState } from 'react';
import { PokerSession } from '../lib/supabase';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

interface BankrollChartProps {
  sessions: PokerSession[];
  bankrollGoal?: number;
}

export function BankrollChart({ sessions, bankrollGoal }: BankrollChartProps) {
  const [excludeSatellites, setExcludeSatellites] = useState(false);
  const [excludeFreeroll, setExcludeFreeroll] = useState(false);

  const getFilteredSessions = () => {
    return sessions
      .filter(s => {
        if (excludeSatellites && s.game_type.toLowerCase().includes('satellite')) {
          return false;
        }
        if (excludeFreeroll && s.game_type.toLowerCase().includes('freeroll')) {
          return false;
        }
        return true;
      })
      .sort((a, b) => new Date(a.session_date).getTime() - new Date(b.session_date).getTime());
  };

  const getChartData = () => {
    const filtered = getFilteredSessions();
    let cumulativeProfit = 0;

    return filtered.map((session, index) => {
      cumulativeProfit += parseFloat(session.profit.toString());
      return {
        sessionNumber: index + 1,
        profit: Math.round(cumulativeProfit * 100) / 100,
        sessionProfit: parseFloat(session.profit.toString()),
      };
    });
  };

  if (sessions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Add sessions to see your bankroll progression
        </p>
      </div>
    );
  }

  const data = getChartData();
  const currentProfit = data.length > 0 ? data[data.length - 1].profit : 0;
  const maxProfit = Math.max(...data.map(d => d.profit), 0);
  const minProfit = Math.min(...data.map(d => d.profit), 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 dark:bg-gray-950 text-white p-3 rounded-lg shadow-lg border border-gray-700">
          <p className="text-sm text-gray-300">Session {data.sessionNumber}</p>
          <p className={`text-lg font-bold ${data.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${data.profit.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Bankroll Progression</h3>
          </div>

          <div className="flex gap-6 items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={excludeSatellites}
                onChange={(e) => setExcludeSatellites(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Exclude Satellites</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={excludeFreeroll}
                onChange={(e) => setExcludeFreeroll(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-400"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Exclude Freeroll Tournaments</span>
            </label>
          </div>
        </div>

        <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-lg p-4 mb-4">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 20, right: 20, left: -20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
              <XAxis
                dataKey="sessionNumber"
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#6b7280' }}
                label={{ value: '$', angle: -90, position: 'insideLeft' }}
                domain={[minProfit - 5, maxProfit + 5]}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={0}
                stroke="#9ca3af"
                strokeDasharray="3 3"
                opacity={0.5}
              />
              {bankrollGoal !== undefined && bankrollGoal > 0 && (
                <ReferenceLine
                  y={bankrollGoal}
                  stroke="#3b82f6"
                  strokeDasharray="5 5"
                  label={{ value: 'Goal', position: 'right', fill: '#3b82f6', fontSize: 12 }}
                />
              )}
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6, fill: '#059669' }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Current Profit</p>
            <p className={`text-2xl font-bold ${currentProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              ${currentProfit.toFixed(2)}
            </p>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Highest</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              ${maxProfit.toFixed(2)}
            </p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Lowest</p>
            <p className={`text-2xl font-bold ${minProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
              ${minProfit.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
