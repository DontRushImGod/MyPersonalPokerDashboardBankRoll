import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { usePokerSessions } from './hooks/usePokerSessions';
import { useDarkMode } from './hooks/useDarkMode';
import { AuthScreen } from './components/AuthScreen';
import { SessionForm } from './components/SessionForm';
import { Statistics } from './components/Statistics';
import { BankrollChart } from './components/BankrollChart';
import { TournamentStats } from './components/TournamentStats';
import { TournamentRadarChart } from './components/TournamentRadarChart';
import { SiteDistribution } from './components/SiteDistribution';
import { SessionHistory } from './components/SessionHistory';
import { supabase } from './lib/supabase';
import { Moon, Sun, LogOut } from 'lucide-react';

function App() {
  const { user, loading: authLoading } = useAuth();
  const { sessions, loading: sessionsLoading, addSession, deleteSession } = usePokerSessions(user);
  const { isDark, toggleDarkMode } = useDarkMode();
  const [menuOpen, setMenuOpen] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen isDark={isDark} toggleDarkMode={toggleDarkMode} />;
  }

  if (sessionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your poker sessions...</p>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

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

      <div className="fixed top-6 right-20 z-40">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 border border-gray-200 dark:border-gray-700"
          title="Account"
        >
          <LogOut className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.email}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-3 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

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

          <TournamentRadarChart sessions={sessions} />

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
