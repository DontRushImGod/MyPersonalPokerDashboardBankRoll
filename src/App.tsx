import { usePokerSessions } from './hooks/usePokerSessions';
import { useDarkMode } from './hooks/useDarkMode';
import { SessionForm } from './components/SessionForm';
import { Statistics } from './components/Statistics';
import { BankrollChart } from './components/BankrollChart';
import { TournamentStats } from './components/TournamentStats';
import { SiteDistribution } from './components/SiteDistribution';
import { SessionHistory } from './components/SessionHistory';
import { Moon, Sun } from 'lucide-react';

function App() {
  const { sessions, loading, addSession, deleteSession } = usePokerSessions();
  const { isDark, toggleDarkMode } = useDarkMode();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your poker sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <button
        onClick={toggleDarkMode}
        className="fixed top-6 right-6 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-40 border border-gray-200 dark:border-gray-700"
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? (
          <Sun className="w-6 h-6 text-yellow-500" />
        ) : (
          <Moon className="w-6 h-6 text-gray-700" />
        )}
      </button>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Poker Bankroll Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your poker sessions, analyze your performance, and manage your bankroll
          </p>
        </header>

        <div className="space-y-6">
          <Statistics sessions={sessions} bankrollGoal={10000} />

          <BankrollChart sessions={sessions} bankrollGoal={10000} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TournamentStats sessions={sessions} />
            <SiteDistribution sessions={sessions} />
          </div>

          <SessionHistory sessions={sessions} onDelete={deleteSession} />
        </div>
      </div>

      <SessionForm onSubmit={addSession} />
    </div>
  );
}

export default App;
