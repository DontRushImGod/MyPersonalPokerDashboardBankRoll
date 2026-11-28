import { useMemo } from 'react';
import {
  Target,
  TrendingUp,
  CalendarDays,
  Layers,
  AlertTriangle,
  ShieldCheck,
  Settings2,
} from 'lucide-react';
import { PokerSession, BankrollGoal } from '../lib/supabase';

interface GoalsPanelProps {
  sessions: PokerSession[];
  goals: BankrollGoal | null;
  onEdit: () => void;
}

interface Alert {
  level: 'danger' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function GoalsPanel({ sessions, goals, onEdit }: GoalsPanelProps) {
  const computed = useMemo(() => {
    const totalBuyIn = sessions.reduce((sum, s) => sum + parseFloat(s.buy_in.toString()), 0);
    const totalCashOut = sessions.reduce((sum, s) => sum + parseFloat(s.cash_out.toString()), 0);
    const netProfit = totalCashOut - totalBuyIn;
    const starting = goals ? parseFloat(goals.starting_bankroll.toString()) : 0;
    const currentBankroll = starting + netProfit;

    const now = new Date();
    const monthStart = startOfMonth(now);
    const dayStart = startOfDay(now);

    const monthSessions = sessions.filter(
      (s) => new Date(s.session_date) >= monthStart
    );
    const monthProfit = monthSessions.reduce(
      (sum, s) => sum + parseFloat(s.profit.toString()),
      0
    );

    const todaySessions = sessions.filter(
      (s) => new Date(s.session_date) >= dayStart
    );
    const todayProfit = todaySessions.reduce(
      (sum, s) => sum + parseFloat(s.profit.toString()),
      0
    );

    const lastSession = sessions[0];

    return {
      currentBankroll,
      netProfit,
      monthProfit,
      monthSessionCount: monthSessions.length,
      todayProfit,
      todaySessionCount: todaySessions.length,
      lastSession,
    };
  }, [sessions, goals]);

  const alerts = useMemo<Alert[]>(() => {
    if (!goals) return [];
    const out: Alert[] = [];

    const last = computed.lastSession;
    if (last) {
      const lastProfit = parseFloat(last.profit.toString());
      const stopLoss = parseFloat(goals.stop_loss.toString());
      const takeProfit = parseFloat(goals.take_profit.toString());

      if (lastProfit <= -stopLoss && stopLoss > 0) {
        out.push({
          level: 'danger',
          title: 'Stop-loss hit',
          message: `Your last session lost $${Math.abs(lastProfit).toFixed(2)}, reaching your stop-loss of $${stopLoss.toFixed(2)}. Consider stepping away.`,
        });
      } else if (lastProfit >= takeProfit && takeProfit > 0) {
        out.push({
          level: 'success',
          title: 'Take-profit reached',
          message: `Your last session won $${lastProfit.toFixed(2)}, hitting your take-profit target of $${takeProfit.toFixed(2)}. A good time to bank the win.`,
        });
      }
    }

    const warningFloor = parseFloat(goals.bankroll_warning.toString());
    if (warningFloor > 0 && computed.currentBankroll < warningFloor) {
      out.push({
        level: 'danger',
        title: 'Bankroll warning',
        message: `Your bankroll is $${computed.currentBankroll.toFixed(2)}, below your warning floor of $${warningFloor.toFixed(2)}. Consider dropping stakes or pausing.`,
      });
    }

    const dailyLimit = parseFloat(goals.daily_loss_limit.toString());
    if (dailyLimit > 0 && computed.todayProfit <= -dailyLimit) {
      out.push({
        level: 'danger',
        title: 'Daily loss limit reached',
        message: `You're down $${Math.abs(computed.todayProfit).toFixed(2)} today, hitting your daily loss limit of $${dailyLimit.toFixed(2)}. Stop for today.`,
      });
    }

    const riskPct = parseFloat(goals.risk_per_session_pct.toString());
    if (last && riskPct > 0 && computed.currentBankroll > 0) {
      const buyIn = parseFloat(last.buy_in.toString());
      const risked = (buyIn / computed.currentBankroll) * 100;
      if (risked > riskPct) {
        out.push({
          level: 'warning',
          title: 'Risk per session exceeded',
          message: `Your last buy-in was ${risked.toFixed(1)}% of your bankroll, above your ${riskPct.toFixed(0)}% limit. Reduce your buy-in to stay within your risk rule.`,
        });
      }
    }

    return out;
  }, [goals, computed]);

  const targets = useMemo(() => {
    if (!goals) return [];
    const target = parseFloat(goals.target_bankroll.toString());
    const monthly = parseFloat(goals.monthly_goal.toString());
    const sessionGoal = goals.session_count_goal;

    const bankrollPct = target > 0 ? (computed.currentBankroll / target) * 100 : 0;
    const monthPct = monthly !== 0 ? (computed.monthProfit / monthly) * 100 : 0;
    const sessionPct = sessionGoal > 0 ? (computed.monthSessionCount / sessionGoal) * 100 : 0;

    return [
      {
        label: 'Bankroll Target',
        icon: Target,
        current: computed.currentBankroll,
        target: target,
        pct: bankrollPct,
        color: bankrollPct >= 100 ? 'bg-green-500' : bankrollPct >= 50 ? 'bg-blue-500' : 'bg-orange-500',
        money: true,
      },
      {
        label: 'Monthly Profit Goal',
        icon: TrendingUp,
        current: computed.monthProfit,
        target: monthly,
        pct: Math.max(0, monthPct),
        color: monthPct >= 100 ? 'bg-green-500' : monthPct >= 50 ? 'bg-blue-500' : 'bg-orange-500',
        money: true,
      },
      {
        label: 'Monthly Sessions',
        icon: CalendarDays,
        current: computed.monthSessionCount,
        target: sessionGoal,
        pct: sessionPct,
        color: sessionPct >= 100 ? 'bg-green-500' : sessionPct >= 50 ? 'bg-blue-500' : 'bg-orange-500',
        money: false,
      },
    ];
  }, [goals, computed]);

  const hasGoals = goals !== null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Goals & Bankroll Rules
          </h3>
        </div>
        <button
          onClick={onEdit}
          className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <Settings2 className="w-4 h-4" />
          {hasGoals ? 'Edit' : 'Set up'}
        </button>
      </div>

      <div className="p-6 space-y-6">
        {!hasGoals && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                Set your goals and bankroll rules
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Define your bankroll target, monthly profit goal, stop-loss, take-profit,
                and risk limits. We'll track your progress and alert you when a rule is triggered.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {targets.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.label}
                className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {t.money ? `$${t.current.toFixed(2)}` : t.current} /{' '}
                  {t.money ? `$${t.target.toFixed(2)}` : t.target}
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full ${t.color} transition-all duration-500 rounded-full`}
                    style={{ width: `${Math.min(Math.max(t.pct, 0), 100)}%` }}
                  />
                </div>
                <p className="text-right text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                  {t.pct.toFixed(0)}%
                </p>
              </div>
            );
          })}
        </div>

        {alerts.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Active Alerts
            </p>
            {alerts.map((alert, i) => {
              const styles: Record<Alert['level'], string> = {
                danger:
                  'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
                warning:
                  'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
                success:
                  'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
                info:
                  'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
              };
              return (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-3.5 rounded-lg border ${styles[alert.level]}`}
                >
                  {alert.level === 'success' ? (
                    <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm font-semibold">{alert.title}</p>
                    <p className="text-sm mt-0.5 opacity-90">{alert.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {hasGoals && alerts.length === 0 && (
          <div className="flex items-center gap-3 p-3.5 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <p className="text-sm text-green-800 dark:text-green-200">
              All clear — no bankroll rules have been triggered.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
