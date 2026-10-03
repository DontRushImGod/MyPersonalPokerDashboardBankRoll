import { PokerSession } from '../lib/supabase';
import { Trophy } from 'lucide-react';

interface TournamentStatsProps {
  sessions: PokerSession[];
}

export function TournamentStats({ sessions }: TournamentStatsProps) {
  const tournamentSessions = sessions.filter(
    s => s.game_type === 'PKO Tournament' || s.game_type === 'nPKO Tournament'
  );

  const pkoSessions = sessions.filter(s => s.game_type === 'PKO Tournament');
  const npkoSessions = sessions.filter(s => s.game_type === 'nPKO Tournament');

  const pkoTotal = pkoSessions.reduce((sum, s) => sum + parseFloat(s.profit.toString()), 0);
  const npkoTotal = npkoSessions.reduce((sum, s) => sum + parseFloat(s.profit.toString()), 0);

  const totalTournamentProfit = pkoTotal + npkoTotal;
  const totalTournamentBuyIn = tournamentSessions.reduce((sum, s) => sum + parseFloat(s.buy_in.toString()), 0);
  const tournamentWinRate = totalTournamentBuyIn > 0 ? ((totalTournamentProfit / totalTournamentBuyIn) * 100) : 0;

  const pkoPercentage = tournamentSessions.length > 0 ? (pkoSessions.length / tournamentSessions.length) * 100 : 0;
  const npkoPercentage = tournamentSessions.length > 0 ? (npkoSessions.length / tournamentSessions.length) * 100 : 0;

  if (tournamentSessions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-ink-900 rounded-xl p-6 border border-ink-200 dark:border-ink-800">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-5 h-5 text-accent-500" />
        <h3 className="text-lg font-bold text-ink-900 dark:text-white">Tournament Statistics</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-accent-50 dark:bg-accent-900/20 rounded-xl p-4 border border-accent-200 dark:border-accent-800">
          <p className="text-sm font-medium text-ink-500 dark:text-ink-400 mb-1">PKO Tournaments</p>
          <p className="text-2xl font-bold text-accent-700 dark:text-accent-400">{pkoSessions.length}</p>
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-2">
            {pkoPercentage.toFixed(1)}% of tournaments
          </p>
          <p className={`text-lg font-semibold mt-2 font-mono ${pkoTotal >= 0 ? 'text-felt-600 dark:text-felt-400' : 'text-red-500'}`}>
            ${pkoTotal.toFixed(2)}
          </p>
        </div>

        <div className="bg-felt-50 dark:bg-felt-900/20 rounded-xl p-4 border border-felt-200 dark:border-felt-800">
          <p className="text-sm font-medium text-ink-500 dark:text-ink-400 mb-1">nPKO Tournaments</p>
          <p className="text-2xl font-bold text-felt-700 dark:text-felt-400">{npkoSessions.length}</p>
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-2">
            {npkoPercentage.toFixed(1)}% of tournaments
          </p>
          <p className={`text-lg font-semibold mt-2 font-mono ${npkoTotal >= 0 ? 'text-felt-600 dark:text-felt-400' : 'text-red-500'}`}>
            ${npkoTotal.toFixed(2)}
          </p>
        </div>

        <div className="bg-ink-50 dark:bg-ink-800/50 rounded-xl p-4 border border-ink-200 dark:border-ink-700">
          <p className="text-sm font-medium text-ink-500 dark:text-ink-400 mb-1">Win Rate</p>
          <p className={`text-2xl font-bold ${tournamentWinRate >= 0 ? 'text-felt-600 dark:text-felt-400' : 'text-red-500'}`}>
            {tournamentWinRate.toFixed(2)}%
          </p>
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-2">
            Total: {tournamentSessions.length} sessions
          </p>
          <p className={`text-lg font-semibold mt-2 font-mono ${totalTournamentProfit >= 0 ? 'text-felt-600 dark:text-felt-400' : 'text-red-500'}`}>
            ${totalTournamentProfit.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
