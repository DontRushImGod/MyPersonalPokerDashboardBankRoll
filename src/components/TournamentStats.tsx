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
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Tournament Statistics</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">PKO Tournaments</p>
          <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{pkoSessions.length}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {pkoPercentage.toFixed(1)}% of tournaments
          </p>
          <p className={`text-lg font-semibold mt-2 ${pkoTotal >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            ${pkoTotal.toFixed(2)}
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">nPKO Tournaments</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{npkoSessions.length}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {npkoPercentage.toFixed(1)}% of tournaments
          </p>
          <p className={`text-lg font-semibold mt-2 ${npkoTotal >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            ${npkoTotal.toFixed(2)}
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Tournament Win Rate</p>
          <p className={`text-2xl font-bold ${tournamentWinRate >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {tournamentWinRate.toFixed(2)}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Total: {tournamentSessions.length} sessions
          </p>
          <p className={`text-lg font-semibold mt-2 ${totalTournamentProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            ${totalTournamentProfit.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
