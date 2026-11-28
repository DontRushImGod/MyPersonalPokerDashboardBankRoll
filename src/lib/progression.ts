import { PokerSession } from './supabase';

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: Rarity;
  unlocked: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  period: 'daily' | 'weekly';
  unit: string;
  completed: boolean;
}

export interface ProgressionState {
  xp: number;
  level: number;
  xpInLevel: number;
  xpForNext: number;
  rankTitle: string;
  pokerRating: number;
  currentStreak: number;
  bestStreak: number;
  badges: Badge[];
  badgesUnlocked: number;
  badgesTotal: number;
  challenges: Challenge[];
  sessionsLogged: number;
}

const pad = (n: number) => n.toString().padStart(2, '0');

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parseDate(s: string): Date {
  return new Date(s);
}

function isNextDay(prevKey: string, curKey: string): boolean {
  const prev = new Date(prevKey + 'T00:00:00');
  prev.setDate(prev.getDate() + 1);
  return dayKey(prev) === curKey;
}

function subtractDay(key: string): string {
  const d = new Date(key + 'T00:00:00');
  d.setDate(d.getDate() - 1);
  return dayKey(d);
}

function startOfWeek(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = x.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday as start
  x.setDate(x.getDate() + diff);
  return x;
}

function dayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

function rankTitle(level: number): string {
  if (level >= 40) return 'Poker Legend';
  if (level >= 30) return 'High Stakes Pro';
  if (level >= 20) return 'Seasoned Pro';
  if (level >= 12) return 'Grinder';
  if (level >= 6) return 'Amateur';
  return 'Rookie';
}

function levelFromXp(xp: number): { level: number; xpInLevel: number; xpForNext: number } {
  const m = Math.floor((Math.sqrt(1 + (8 * xp) / 100) - 1) / 2);
  const level = m + 1;
  const cumulative = (100 * m * (m + 1)) / 2;
  const xpInLevel = xp - cumulative;
  const xpForNext = 100 * level;
  return { level, xpInLevel, xpForNext };
}

function xpForSession(s: PokerSession): number {
  const profit = parseFloat(s.profit.toString());
  const buyIn = Math.max(parseFloat(s.buy_in.toString()), 1);
  const duration = parseFloat(s.duration.toString()) || 0;
  let xp = 50;
  if (profit > 0) xp += 25;
  xp += Math.min(duration / 10, 60);
  const roi = profit / buyIn;
  xp += Math.max(0, Math.min(roi * 50, 100));
  return Math.round(xp);
}

function ratingForSessions(sessions: PokerSession[]): number {
  let rating = 1000;
  const oldestFirst = [...sessions].sort(
    (a, b) => new Date(a.session_date).getTime() - new Date(b.session_date).getTime()
  );
  for (const s of oldestFirst) {
    const profit = parseFloat(s.profit.toString());
    const buyIn = Math.max(parseFloat(s.buy_in.toString()), 1);
    const delta = Math.max(-40, Math.min((profit / buyIn) * 25, 40));
    rating += delta + (profit > 0 ? 3 : -2);
  }
  return Math.round(rating);
}

function computeStreaks(sessions: PokerSession[]): { current: number; best: number } {
  const days = new Set(sessions.map((s) => dayKey(parseDate(s.session_date))));
  const sorted = [...days].sort();

  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of sorted) {
    if (prev && isNextDay(prev, d)) run++;
    else run = 1;
    best = Math.max(best, run);
    prev = d;
  }

  const now = new Date();
  const today = dayKey(now);
  const yesterdayKey = subtractDay(today);

  let current = 0;
  let cursor: string | null = days.has(today) ? today : days.has(yesterdayKey) ? yesterdayKey : null;
  if (cursor) {
    current = 1;
    let c = cursor;
    while (days.has(subtractDay(c))) {
      current++;
      c = subtractDay(c);
    }
  }
  return { current, best };
}

interface BadgeStats {
  count: number;
  profitable: number;
  maxProfit: number;
  maxBuyIn: number;
  totalProfit: number;
  totalBuyIn: number;
  maxWinStreak: number;
  currentWinStreak: number;
  sites: Set<string>;
  gameTypes: Set<string>;
  nightSessions: number;
  weekendSessions: number;
  sessionsThisMonth: number;
  longestDuration: number;
  cameBackPositive: boolean;
  hadLoss: boolean;
}

function computeBadgeStats(sessions: PokerSession[]): BadgeStats {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const sorted = [...sessions].sort(
    (a, b) => new Date(a.session_date).getTime() - new Date(b.session_date).getTime()
  );

  let maxWinStreak = 0;
  let winStreak = 0;
  let cumulative = 0;
  let hadLoss = false;
  let cameBackPositive = false;

  for (let i = 0; i < sorted.length; i++) {
    const profit = parseFloat(sorted[i].profit.toString());
    if (profit > 0) {
      winStreak++;
      maxWinStreak = Math.max(maxWinStreak, winStreak);
    } else {
      winStreak = 0;
    }
    cumulative += profit;
    if (profit < 0) hadLoss = true;
    if (hadLoss && cumulative > 0) cameBackPositive = true;
  }

  const sites = new Set<string>();
  const gameTypes = new Set<string>();
  let nightSessions = 0;
  let weekendSessions = 0;
  let sessionsThisMonth = 0;
  let longestDuration = 0;
  let maxProfit = 0;
  let maxBuyIn = 0;
  let totalProfit = 0;
  let totalBuyIn = 0;
  let profitable = 0;

  for (const s of sorted) {
    const profit = parseFloat(s.profit.toString());
    const buyIn = parseFloat(s.buy_in.toString());
    const duration = parseFloat(s.duration.toString()) || 0;
    const d = parseDate(s.session_date);
    const hour = d.getHours();
    const day = d.getDay();

    sites.add(s.location);
    gameTypes.add(s.game_type);
    if (hour >= 0 && hour < 5) nightSessions++;
    if (day === 0 || day === 6) weekendSessions++;
    if (d >= monthStart) sessionsThisMonth++;
    if (duration > longestDuration) longestDuration = duration;
    if (profit > maxProfit) maxProfit = profit;
    if (buyIn > maxBuyIn) maxBuyIn = buyIn;
    totalProfit += profit;
    totalBuyIn += buyIn;
    if (profit > 0) profitable++;
  }

  // current win streak: recompute from the end
  let cur = 0;
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (parseFloat(sorted[i].profit.toString()) > 0) cur++;
    else break;
  }

  return {
    count: sorted.length,
    profitable,
    maxProfit,
    maxBuyIn,
    totalProfit,
    totalBuyIn,
    maxWinStreak,
    currentWinStreak: cur,
    sites,
    gameTypes,
    nightSessions,
    weekendSessions,
    sessionsThisMonth,
    longestDuration,
    cameBackPositive,
    hadLoss,
  };
}

interface BadgeDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: Rarity;
  test: (s: BadgeStats) => boolean;
}

const BADGE_DEFS: BadgeDef[] = [
  { id: 'first_steps', name: 'First Steps', description: 'Log your first session', icon: 'Footprints', rarity: 'common', test: (s) => s.count >= 1 },
  { id: 'getting_started', name: 'Getting Started', description: 'Log 5 sessions', icon: 'Sparkles', rarity: 'common', test: (s) => s.count >= 5 },
  { id: 'grinder', name: 'Grinder', description: 'Log 25 sessions', icon: 'Dumbbell', rarity: 'rare', test: (s) => s.count >= 25 },
  { id: 'marathon', name: 'Marathon Player', description: 'Log 100 sessions', icon: 'Medal', rarity: 'legendary', test: (s) => s.count >= 100 },
  { id: 'first_win', name: 'First Win', description: 'Finish a session in profit', icon: 'Trophy', rarity: 'common', test: (s) => s.profitable >= 1 },
  { id: 'hot_streak', name: 'Hot Streak', description: '3 profitable sessions in a row', icon: 'Flame', rarity: 'rare', test: (s) => s.maxWinStreak >= 3 },
  { id: 'on_fire', name: 'On Fire', description: '5 profitable sessions in a row', icon: 'Zap', rarity: 'epic', test: (s) => s.maxWinStreak >= 5 },
  { id: 'big_win', name: 'Big Win', description: 'Win $500+ in a single session', icon: 'Coins', rarity: 'epic', test: (s) => s.maxProfit >= 500 },
  { id: 'high_roller', name: 'High Roller', description: 'Buy in for $1,000+', icon: 'Gem', rarity: 'epic', test: (s) => s.maxBuyIn >= 1000 },
  { id: 'profit_maker', name: 'Profit Maker', description: 'Reach $1,000 total profit', icon: 'TrendingUp', rarity: 'rare', test: (s) => s.totalProfit >= 1000 },
  { id: 'big_spender', name: 'Big Spender', description: 'Wager $10,000 total', icon: 'Crown', rarity: 'rare', test: (s) => s.totalBuyIn >= 10000 },
  { id: 'night_owl', name: 'Night Owl', description: 'Play between midnight and 5am', icon: 'Moon', rarity: 'rare', test: (s) => s.nightSessions >= 1 },
  { id: 'weekend_warrior', name: 'Weekend Warrior', description: 'Play on a weekend', icon: 'Calendar', rarity: 'common', test: (s) => s.weekendSessions >= 1 },
  { id: 'marathon_session', name: 'Endurance', description: 'Play a 180+ minute session', icon: 'Clock', rarity: 'rare', test: (s) => s.longestDuration >= 180 },
  { id: 'multi_site', name: 'Multi-Tabler', description: 'Play on 3 different sites', icon: 'Layers', rarity: 'rare', test: (s) => s.sites.size >= 3 },
  { id: 'variety_pack', name: 'Variety Pack', description: 'Play 3 different game types', icon: 'Shapes', rarity: 'rare', test: (s) => s.gameTypes.size >= 3 },
  { id: 'consistency', name: 'Consistent', description: 'Log 10 sessions in one month', icon: 'Target', rarity: 'rare', test: (s) => s.sessionsThisMonth >= 10 },
  { id: 'comeback', name: 'Comeback King', description: 'Recover from a loss into profit', icon: 'Rocket', rarity: 'epic', test: (s) => s.cameBackPositive },
];

function computeBadges(stats: BadgeStats): Badge[] {
  return BADGE_DEFS.map((d) => ({
    id: d.id,
    name: d.name,
    description: d.description,
    icon: d.icon,
    rarity: d.rarity,
    unlocked: d.test(stats),
  }));
}

interface ChallengeDef {
  id: string;
  title: string;
  description: string;
  target: number;
  unit: string;
  compute: (sessions: PokerSession[], windowStart: Date, windowEnd: Date) => number;
}

function inWindow(s: PokerSession, start: Date, end: Date): boolean {
  const d = parseDate(s.session_date);
  return d >= start && d < end;
}

const DAILY_POOL: ChallengeDef[] = [
  { id: 'd_log', title: 'Log a Session', description: 'Record one session today', target: 1, unit: 'session', compute: (ss, st, en) => ss.filter((s) => inWindow(s, st, en)).length },
  { id: 'd_profit', title: 'In the Green', description: 'Finish a session in profit today', target: 1, unit: 'session', compute: (ss, st, en) => ss.filter((s) => inWindow(s, st, en) && parseFloat(s.profit.toString()) > 0).length },
  { id: 'd_play60', title: 'Hour of Play', description: 'Play 60+ minutes today', target: 60, unit: 'min', compute: (ss, st, en) => ss.filter((s) => inWindow(s, st, en)).reduce((sum, s) => sum + (parseFloat(s.duration.toString()) || 0), 0) },
  { id: 'd_wins', title: 'Double Win', description: 'Have 2 profitable sessions today', target: 2, unit: 'wins', compute: (ss, st, en) => ss.filter((s) => inWindow(s, st, en) && parseFloat(s.profit.toString()) > 0).length },
  { id: 'd_notes', title: 'Reflective', description: 'Log a session with notes today', target: 1, unit: 'session', compute: (ss, st, en) => ss.filter((s) => inWindow(s, st, en) && s.notes && s.notes.trim().length > 0).length },
];

const WEEKLY_POOL: ChallengeDef[] = [
  { id: 'w_log5', title: 'Weekly Grinder', description: 'Log 5 sessions this week', target: 5, unit: 'sessions', compute: (ss, st, en) => ss.filter((s) => inWindow(s, st, en)).length },
  { id: 'w_profit100', title: 'Centurion', description: 'Earn $100 profit this week', target: 100, unit: '$', compute: (ss, st, en) => ss.filter((s) => inWindow(s, st, en)).reduce((sum, s) => sum + parseFloat(s.profit.toString()), 0) },
  { id: 'w_3types', title: 'Variety Week', description: 'Play 3 different game types', target: 3, unit: 'types', compute: (ss, st, en) => new Set(ss.filter((s) => inWindow(s, st, en)).map((s) => s.game_type)).size },
  { id: 'w_wins3', title: 'Triple Win', description: 'Win 3 sessions this week', target: 3, unit: 'wins', compute: (ss, st, en) => ss.filter((s) => inWindow(s, st, en) && parseFloat(s.profit.toString()) > 0).length },
  { id: 'w_sites2', title: 'Multi-Site Week', description: 'Play on 2 different sites', target: 2, unit: 'sites', compute: (ss, st, en) => new Set(ss.filter((s) => inWindow(s, st, en)).map((s) => s.location)).size },
];

function rotate<T>(pool: T[], seed: number): T[] {
  const n = pool.length;
  const offset = ((seed % n) + n) % n;
  return [...pool.slice(offset), ...pool.slice(0, offset)];
}

function computeChallenges(sessions: PokerSession[]): Challenge[] {
  const now = new Date();
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);
  const weekStart = startOfWeek(now);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const dy = dayOfYear(now);
  const dailyDefs = rotate(DAILY_POOL, dy).slice(0, 3);
  const weeklyDefs = rotate(WEEKLY_POOL, Math.floor(dy / 7)).slice(0, 3);

  const build = (def: ChallengeDef, period: 'daily' | 'weekly', start: Date, end: Date): Challenge => {
    const progress = def.compute(sessions, start, end);
    return {
      id: def.id,
      title: def.title,
      description: def.description,
      target: def.target,
      progress: Math.max(0, Math.min(progress, def.target)),
      period,
      unit: def.unit,
      completed: progress >= def.target,
    };
  };

  return [
    ...dailyDefs.map((d) => build(d, 'daily', dayStart, dayEnd)),
    ...weeklyDefs.map((d) => build(d, 'weekly', weekStart, weekEnd)),
  ];
}

export function computeProgression(sessions: PokerSession[]): ProgressionState {
  const xp = sessions.reduce((sum, s) => sum + xpForSession(s), 0);
  const { level, xpInLevel, xpForNext } = levelFromXp(xp);
  const stats = computeBadgeStats(sessions);
  const badges = computeBadges(stats);
  const { current, best } = computeStreaks(sessions);

  return {
    xp,
    level,
    xpInLevel,
    xpForNext,
    rankTitle: rankTitle(level),
    pokerRating: ratingForSessions(sessions),
    currentStreak: current,
    bestStreak: best,
    badges,
    badgesUnlocked: badges.filter((b) => b.unlocked).length,
    badgesTotal: badges.length,
    challenges: computeChallenges(sessions),
    sessionsLogged: sessions.length,
  };
}
