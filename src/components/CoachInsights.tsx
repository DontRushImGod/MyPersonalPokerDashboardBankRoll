import { useMemo } from 'react';
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { PokerSession } from '../lib/supabase';
import { computeInsights, type Insight, type InsightType } from '../lib/coach';

interface CoachInsightsProps {
  sessions: PokerSession[];
}

function typeMeta(type: InsightType) {
  switch (type) {
    case 'strength':
      return { icon: TrendingUp, label: 'Strength', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800' };
    case 'weakness':
      return { icon: AlertTriangle, label: 'Weakness', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800' };
    case 'pattern':
      return { icon: Sparkles, label: 'Pattern', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' };
    case 'recommendation':
      return { icon: Lightbulb, label: 'Tip', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800' };
  }
}

function InsightCard({ insight }: { insight: Insight }) {
  const meta = typeMeta(insight.type);
  const Icon = meta.icon;

  return (
    <div className={`rounded-lg border p-4 ${meta.bg} ${meta.border} transition-all hover:shadow-sm`}>
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.bg} border ${meta.border}`}>
          <Icon className={`w-5 h-5 ${meta.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-semibold uppercase tracking-wide ${meta.color}`}>
              {meta.label}
            </span>
          </div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
            {insight.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
            {insight.message}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 flex items-center gap-1">
            <ChevronRight className="w-3 h-3" />
            {insight.evidence}
          </p>
        </div>
      </div>
    </div>
  );
}

export function CoachInsights({ sessions }: CoachInsightsProps) {
  const insights = useMemo(() => computeInsights(sessions), [sessions]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Coach</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Pattern-based insights from your sessions
            </p>
          </div>
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
          {insights.length} insight{insights.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="p-6 space-y-3">
        {insights.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-6">
            No insights available yet. Keep logging sessions.
          </p>
        ) : (
          insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))
        )}
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center pt-2">
          Insights are generated from your session data and refresh automatically. This is
          pattern-based analysis, not financial advice.
        </p>
      </div>
    </div>
  );
}
