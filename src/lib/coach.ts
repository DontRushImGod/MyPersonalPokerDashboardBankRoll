import { PokerSession } from './supabase';

export type InsightType = 'strength' | 'weakness' | 'pattern' | 'recommendation';
export type Severity = 'positive' | 'neutral' | 'warning';

export interface Insight {
  id: string;
  type: InsightType;
  severity: Severity;
  title: string;
  message: string;
  evidence: string;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface SessionDerived {
  profit: number;
  buyIn: number;
  cashOut: number;
  duration: number;
  date: Date;
  roi: number;
}

function derive(s: PokerSession): SessionDerived {
  const profit = parseFloat(s.profit.toString());
  const buyIn = Math.max(parseFloat(s.buy_in.toString()), 1);
  const cashOut = parseFloat(s.cash_out.toString());
  const duration = parseFloat(s.duration.toString()) || 0;
  return {
    profit,
    buyIn,
    cashOut,
    duration,
    date: new Date(s.session_date),
    roi: profit / buyIn,
  };
}

interface SiteStats {
  name: string;
  count: number;
  profit: number;
  roi: number;
  winRate: number;
}

interface GameStats {
  name: string;
  count: number;
  profit: number;
  roi: number;
  winRate: number;
}

interface DayStats {
  day: number;
  count: number;
  profit: number;
  winRate: number;
}

export function computeInsights(sessions: PokerSession[]): Insight[] {
  if (sessions.length < 5) {
    return [
      {
        id: 'need_data',
        type: 'recommendation',
        severity: 'neutral',
        title: 'Keep logging sessions',
        message:
          "Your coach needs at least 5 logged sessions to start spotting patterns in your play. You're almost there — every session you log makes the insights sharper.",
        evidence: `${sessions.length} session${sessions.length === 1 ? '' : 's'} logged so far.`,
      },
    ];
  }

  const derived = sessions.map(derive);
  const insights: Insight[] = [];

  const totalProfit = derived.reduce((sum, s) => sum + s.profit, 0);
  const totalBuyIn = derived.reduce((sum, s) => sum + s.buyIn, 0);
  const totalWins = derived.filter((s) => s.profit > 0).length;
  const overallWinRate = totalWins / derived.length;
  const overallRoi = totalBuyIn > 0 ? totalProfit / totalBuyIn : 0;

  // --- Best site ---
  // recompute with real site names
  const siteMap = new Map<string, SessionDerived[]>();
  for (const s of derived) {
    const orig = sessions.find((ps) => derive(ps).date.getTime() === s.date.getTime());
    const name = orig?.location ?? 'Unknown';
    if (!siteMap.has(name)) siteMap.set(name, []);
    siteMap.get(name)!.push(s);
  }
  const siteResults: SiteStats[] = [];
  siteMap.forEach((arr, name) => {
    const tb = arr.reduce((sum, s) => sum + s.buyIn, 0);
    const tp = arr.reduce((sum, s) => sum + s.profit, 0);
    const w = arr.filter((s) => s.profit > 0).length;
    siteResults.push({
      name,
      count: arr.length,
      profit: tp,
      roi: tb > 0 ? tp / tb : 0,
      winRate: arr.length > 0 ? w / arr.length : 0,
    });
  });

  if (siteResults.length > 1) {
    const best = [...siteResults].sort((a, b) => b.roi - a.roi)[0];
    const worst = [...siteResults].sort((a, b) => a.roi - b.roi)[0];
    if (best.count >= 3 && best.roi > 0) {
      insights.push({
        id: 'best_site',
        type: 'strength',
        severity: 'positive',
        title: `${best.name} is your strongest site`,
        message: `Your ROI on ${best.name} is ${(best.roi * 100).toFixed(0)}% across ${best.count} sessions — significantly better than your other sites. Consider focusing more volume here.`,
        evidence: `${best.name}: $${best.profit.toFixed(2)} profit on $${best.count} sessions.`,
      });
    }
    if (worst.count >= 3 && worst.roi < -0.1) {
      insights.push({
        id: 'worst_site',
        type: 'weakness',
        severity: 'warning',
        title: `${worst.name} is costing you`,
        message: `You're losing ${Math.abs((worst.roi * 100)).toFixed(0)}% ROI on ${worst.name} over ${worst.count} sessions. It may be worth reviewing your approach there or reducing volume.`,
        evidence: `${worst.name}: $${worst.profit.toFixed(2)} on ${worst.count} sessions.`,
      });
    }
  }

  // --- Best / worst game type ---
  const gameMap = new Map<string, SessionDerived[]>();
  for (const s of derived) {
    const orig = sessions.find((ps) => derive(ps).date.getTime() === s.date.getTime());
    const name = orig?.game_type ?? 'Unknown';
    if (!gameMap.has(name)) gameMap.set(name, []);
    gameMap.get(name)!.push(s);
  }
  const gameResults: GameStats[] = [];
  gameMap.forEach((arr, name) => {
    const tb = arr.reduce((sum, s) => sum + s.buyIn, 0);
    const tp = arr.reduce((sum, s) => sum + s.profit, 0);
    const w = arr.filter((s) => s.profit > 0).length;
    gameResults.push({
      name,
      count: arr.length,
      profit: tp,
      roi: tb > 0 ? tp / tb : 0,
      winRate: arr.length > 0 ? w / arr.length : 0,
    });
  });

  if (gameResults.length > 1) {
    const bestGame = [...gameResults].sort((a, b) => b.roi - a.roi)[0];
    const worstGame = [...gameResults].sort((a, b) => a.roi - b.roi)[0];
    if (bestGame.count >= 3 && bestGame.roi > worstGame.roi * 2) {
      insights.push({
        id: 'best_game',
        type: 'pattern',
        severity: 'positive',
        title: `${bestGame.name} suits your style`,
        message: `Your ${bestGame.name} ROI of ${(bestGame.roi * 100).toFixed(0)}% is more than double your ${worstGame.name} ROI. You may have a natural edge in this format.`,
        evidence: `${bestGame.name}: ${(bestGame.roi * 100).toFixed(0)}% ROI vs ${worstGame.name}: ${(worstGame.roi * 100).toFixed(0)}%.`,
      });
    }
  }

  // --- Day of week analysis ---
  const dayMap = new Map<number, SessionDerived[]>();
  for (const s of derived) {
    const d = s.date.getDay();
    if (!dayMap.has(d)) dayMap.set(d, []);
    dayMap.get(d)!.push(s);
  }
  const dayResults: DayStats[] = [];
  dayMap.forEach((arr, day) => {
    const tp = arr.reduce((sum, s) => sum + s.profit, 0);
    const w = arr.filter((s) => s.profit > 0).length;
    dayResults.push({ day, count: arr.length, profit: tp, winRate: arr.length > 0 ? w / arr.length : 0 });
  });

  if (dayResults.length >= 2) {
    const bestDay = [...dayResults].sort((a, b) => b.profit / b.count - a.profit / a.count)[0];
    const worstDay = [...dayResults].sort((a, b) => a.profit / a.count - b.profit / b.count)[0];
    if (bestDay.count >= 2 && bestDay.profit > 0 && bestDay.day !== worstDay.day) {
      insights.push({
        id: 'best_day',
        type: 'pattern',
        severity: 'positive',
        title: `${DAY_NAMES[bestDay.day]}s are your best days`,
        message: `You average $${(bestDay.profit / bestDay.count).toFixed(2)} per session on ${DAY_NAMES[bestDay.day]}s. If your schedule allows, concentrate more sessions on this day.`,
        evidence: `${DAY_NAMES[bestDay.day]}: $${bestDay.profit.toFixed(2)} over ${bestDay.count} sessions.`,
      });
    }
    if (worstDay.count >= 2 && worstDay.profit < 0) {
      insights.push({
        id: 'worst_day',
        type: 'weakness',
        severity: 'warning',
        title: `${DAY_NAMES[worstDay.day]}s are leaking money`,
        message: `You're averaging $${(worstDay.profit / worstDay.count).toFixed(2)} per session on ${DAY_NAMES[worstDay.day]}s. Consider whether fatigue or schedule pressure is affecting your play, or take the day off.`,
        evidence: `${DAY_NAMES[worstDay.day]}: $${worstDay.profit.toFixed(2)} over ${worstDay.count} sessions.`,
      });
    }
  }

  // --- Session duration vs profitability ---
  const shortSessions = derived.filter((s) => s.duration > 0 && s.duration < 30);
  const longSessions = derived.filter((s) => s.duration >= 120);
  if (shortSessions.length >= 3) {
    const shortWinRate = shortSessions.filter((s) => s.profit > 0).length / shortSessions.length;
    if (shortWinRate < overallWinRate - 0.15) {
      insights.push({
        id: 'short_sessions',
        type: 'weakness',
        severity: 'warning',
        title: 'Short sessions underperform',
        message: `Sessions under 30 minutes have a ${(shortWinRate * 100).toFixed(0)}% win rate, well below your ${(overallWinRate * 100).toFixed(0)}% average. Short sessions may mean you're playing distracted or tilting — try committing to longer, focused sessions.`,
        evidence: `${shortSessions.length} short sessions, ${(shortWinRate * 100).toFixed(0)}% win rate.`,
      });
    }
  }
  if (longSessions.length >= 3) {
    const longWinRate = longSessions.filter((s) => s.profit > 0).length / longSessions.length;
    if (longWinRate > overallWinRate + 0.1) {
      insights.push({
        id: 'long_sessions',
        type: 'strength',
        severity: 'positive',
        title: 'You thrive in long sessions',
        message: `Your 2+ hour sessions have a ${(longWinRate * 100).toFixed(0)}% win rate, above your ${(overallWinRate * 100).toFixed(0)}% average. When you can focus for longer, you play better — plan sessions when you have time to settle in.`,
        evidence: `${longSessions.length} long sessions, ${(longWinRate * 100).toFixed(0)}% win rate.`,
      });
    }
  }

  // --- Tilt detection: loss after loss ---
  const sorted = [...derived].sort((a, b) => a.date.getTime() - b.date.getTime());
  let tiltStreaks = 0;
  let currentLosses = 0;
  let worstTiltRun = 0;
  for (const s of sorted) {
    if (s.profit < 0) {
      currentLosses++;
      worstTiltRun = Math.max(worstTiltRun, currentLosses);
    } else {
      if (currentLosses >= 3) tiltStreaks++;
      currentLosses = 0;
    }
  }
  if (currentLosses >= 3) tiltStreaks++;
  if (tiltStreaks >= 1 || worstTiltRun >= 4) {
    insights.push({
      id: 'tilt_risk',
      type: 'recommendation',
      severity: 'warning',
      title: 'Watch for tilt after losing streaks',
      message: `You've had runs of ${worstTiltRun}+ consecutive losses. After a bad stretch, consider a short break before your next session — chasing losses tends to deepen them.`,
      evidence: `Longest losing run: ${worstTiltRun} sessions.`,
    });
  }

  // --- Overall profitability ---
  if (totalProfit > 0 && derived.length >= 10) {
    insights.push({
      id: 'profitable',
      type: 'strength',
      severity: 'positive',
      title: "You're a winning player",
      message: `Across ${derived.length} sessions you're up $${totalProfit.toFixed(2)} with a ${(overallRoi * 100).toFixed(1)}% ROI. Keep doing what works — consistent volume with your current approach should grow the bankroll.`,
      evidence: `$${totalProfit.toFixed(2)} profit, ${(overallRoi * 100).toFixed(1)}% ROI, ${(overallWinRate * 100).toFixed(0)}% win rate.`,
    });
  } else if (totalProfit < 0 && derived.length >= 10) {
    insights.push({
      id: 'losing',
      type: 'recommendation',
      severity: 'warning',
      title: 'Time to review your strategy',
      message: `You're down $${Math.abs(totalProfit).toFixed(2)} over ${derived.length} sessions. Consider dropping down in stakes, studying your losing sessions, and tightening your game selection until results improve.`,
      evidence: `-$${Math.abs(totalProfit).toFixed(2)}, ${(overallRoi * 100).toFixed(1)}% ROI.`,
    });
  }

  // --- Recent trend (last 5 vs previous 5) ---
  if (derived.length >= 10) {
    const recent = sorted.slice(-5);
    const previous = sorted.slice(-10, -5);
    const recentProfit = recent.reduce((sum, s) => sum + s.profit, 0);
    const prevProfit = previous.reduce((sum, s) => sum + s.profit, 0);
    if (prevProfit < 0 && recentProfit > prevProfit) {
      insights.push({
        id: 'trend_up',
        type: 'pattern',
        severity: 'positive',
        title: "You're trending upward",
        message: `Your last 5 sessions earned $${recentProfit.toFixed(2)}, up from $${prevProfit.toFixed(2)} in the 5 before that. Whatever you've changed is working — keep it up.`,
        evidence: `Last 5: $${recentProfit.toFixed(2)} vs previous 5: $${prevProfit.toFixed(2)}.`,
      });
    } else if (prevProfit > 0 && recentProfit < prevProfit) {
      insights.push({
        id: 'trend_down',
        type: 'pattern',
        severity: 'warning',
        title: 'Recent results are slipping',
        message: `Your last 5 sessions earned $${recentProfit.toFixed(2)}, down from $${prevProfit.toFixed(2)} in the 5 before that. Check whether stakes, site, or focus have changed — a small adjustment now can prevent a bigger downswing.`,
        evidence: `Last 5: $${recentProfit.toFixed(2)} vs previous 5: $${prevProfit.toFixed(2)}.`,
      });
    }
  }

  return insights.slice(0, 8);
}
