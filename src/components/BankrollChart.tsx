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
      <div className="bg-white dark:bg-ink-900 rounded-xl p-8 border border-ink-200 dark:border-ink-800 text-center">
        <TrendingUp className="w-10 h-10 text-ink-300 dark:text-ink-700 mx-auto mb-3" />
        <p className="text-ink-500 dark:text-ink-400">
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
        <div className="bg-ink-900 dark:bg-ink-950 text-white p-3 rounded-lg shadow-felt-lg border border-ink-700">
          <p className="text-sm text-ink-300">Session {data.sessionNumber}</p>
          <p className={`text-lg font-bold ${data.profit >= 0 ? 'text-felt-400' : 'text-red-400'}`}>
            ${data.profit.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800 overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-felt-600 dark:text-felt-400" />
            <h3 className="text-lg font-bold text-ink-900 dark:text-white">Bankroll Progression</h3>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={excludeSatellites}
                onChange={(e) => setExcludeSatellites(e.target.checked)}
                className="w-4 h-4 rounded border-ink-300 dark:border-ink-600 bg-white dark:bg-ink-800 text-felt-600 focus:ring-felt-500"
              />
              <span className="text-sm font-medium text-ink-600 dark:text-ink-300">Exclude Satellites</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={excludeFreeroll}
                onChange={(e) => setExcludeFreeroll(e.target.checked)}
                className="w-4 h-4 rounded border-ink-300 dark:border-ink-600 bg-white dark:bg-ink-800 text-felt-600 focus:ring-felt-500"
              />
              <span className="text-sm font-medium text-ink-600 dark:text-ink-300">Exclude Freerolls</span>
            </label>
          </div>
        </div>

        <div className="bg-ink-50 dark:bg-ink-800/50 rounded-xl p-4 mb-4">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 20, right: 20, left: -20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.5} />
              <XAxis
                dataKey="sessionNumber"
                stroke="#64748b"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#64748b' }}
              />
              <YAxis
                stroke="#64748b"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#64748b' }}
                label={{ value: '$', angle: -90, position: 'insideLeft' }}
                domain={[minProfit - 5, maxProfit + 5]}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={0}
                stroke="#94a3b8"
                strokeDasharray="3 3"
                opacity={0.5}
              />
              {bankrollGoal !== undefined && bankrollGoal > 0 && (
                <ReferenceLine
                  y={bankrollGoal}
                  stroke="#f59e0b"
                  strokeDasharray="5 5"
                  label={{ value: 'Goal', position: 'right', fill: '#f59e0b', fontSize: 12 }}
                />
              )}
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#2d8e75"
                strokeWidth={2.5}
                dot={{ fill: '#2d8e75', r: 3 }}
                activeDot={{ r: 6, fill: '#1f725c' }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-felt-50 dark:bg-felt-900/20 rounded-lg p-4 border border-felt-200 dark:border-felt-800">
            <p className="text-xs font-medium text-ink-500 dark:text-ink-400 mb-1">Current Profit</p>
            <p className={`text-xl font-bold ${currentProfit >= 0 ? 'text-felt-600 dark:text-felt-400' : 'text-red-500'}`}>
              ${currentProfit.toFixed(2)}
            </p>
          </div>

          <div className="bg-felt-50 dark:bg-felt-900/20 rounded-lg p-4 border border-felt-200 dark:border-felt-800">
            <p className="text-xs font-medium text-ink-500 dark:text-ink-400 mb-1">Highest</p>
            <p className="text-xl font-bold text-felt-600 dark:text-felt-400">
              ${maxProfit.toFixed(2)}
            </p>
          </div>

          <div className="bg-accent-50 dark:bg-accent-900/20 rounded-lg p-4 border border-accent-200 dark:border-accent-800">
            <p className="text-xs font-medium text-ink-500 dark:text-ink-400 mb-1">Lowest</p>
            <p className={`text-xl font-bold ${minProfit >= 0 ? 'text-felt-600 dark:text-felt-400' : 'text-accent-600 dark:text-accent-400'}`}>
              ${minProfit.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
