import { useState, useEffect, useRef } from 'react';
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
import { Moon, Sun, LogOut, Spade, ChevronDown, AlertCircle, X } from 'lucide-react';
import { LoadingScreen } from './components/LoadingScreen';

function App() {
  const { user, loading: authLoading } = useAuth();
  const { sessions, loading: sessionsLoading, addSession, deleteSession } = usePokerSessions(user);
  const { isDark, toggleDarkMode } = useDarkMode();
  const [menuOpen, setMenuOpen] = useState(false);
  const [authTimeout, setAuthTimeout] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authLoading) {
      const t = setTimeout(() => setAuthTimeout(true), 4000);
      return () => clearTimeout(t);
    }
  }, [authLoading]);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  if (authLoading && !authTimeout) {
    return <LoadingScreen />;
  }

  if (authLoading && authTimeout) {
    return <AuthScreen isDark={isDark} toggleDarkMode={toggleDarkMode} />;
  }

  if (!user) {
    return <AuthScreen isDark={isDark} toggleDarkMode={toggleDarkMode} />;
  }

  if (sessionsLoading) {
    return <LoadingScreen message="Loading your poker sessions..." />;
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
  };

  const handleAddSession = async (session: Parameters<typeof addSession>[0]) => {
    const success = await addSession(session);
    if (success) {
      setToast({ message: 'Session added successfully', type: 'success' });
    } else {
      setToast({ message: 'Failed to add session. Please try again.', type: 'error' });
    }
    return success;
  };

  const handleDeleteSession = async (id: string) => {
    const success = await deleteSession(id);
    if (success) {
      setToast({ message: 'Session deleted', type: 'success' });
    } else {
      setToast({ message: 'Failed to delete session. Please try again.', type: 'error' });
    }
    return success;
  };

  return (
    <div className="min-h-screen bg-ink-100 dark:bg-ink-950 transition-colors duration-300">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-ink-50/90 dark:bg-ink-900/80 backdrop-blur-md border-b border-ink-200 dark:border-ink-800">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-felt-600 rounded-xl shadow-felt">
                <Spade className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-ink-900 dark:text-white leading-tight">
                  Bankroll Dashboard
                </h1>
                <p className="text-xs text-ink-500 dark:text-ink-400 hidden sm:block">
                  Track sessions, analyze performance, manage your bankroll
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-lg bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 hover:bg-ink-200 dark:hover:bg-ink-700 transition-colors border border-ink-200 dark:border-ink-700"
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-200 hover:bg-ink-200 dark:hover:bg-ink-700 transition-colors border border-ink-200 dark:border-ink-700"
                >
                  <span className="text-sm font-medium hidden sm:inline truncate max-w-[160px]">
                    {user.email}
                  </span>
                  <ChevronDown className="w-4 h-4 text-ink-400 flex-shrink-0" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-ink-800 rounded-xl shadow-felt-lg border border-ink-200 dark:border-ink-700 overflow-hidden">
                    <div className="px-4 py-3 border-b border-ink-200 dark:border-ink-700">
                      <p className="text-xs font-medium text-ink-400 uppercase tracking-wide mb-1">Signed in as</p>
                      <p className="text-sm font-medium text-ink-900 dark:text-white truncate">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-3 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        <div className="space-y-6">
          <Statistics sessions={sessions} bankrollGoal={10000} />

          <BankrollChart sessions={sessions} bankrollGoal={10000} />

          <TournamentRadarChart sessions={sessions} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TournamentStats sessions={sessions} />
            <SiteDistribution sessions={sessions} />
          </div>

          <SessionHistory sessions={sessions} onDelete={handleDeleteSession} />
        </div>
      </main>

      <SessionForm onSubmit={handleAddSession} />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-felt-lg border ${
            toast.type === 'error'
              ? 'bg-red-600 text-white border-red-700'
              : 'bg-felt-600 text-white border-felt-700'
          }`}>
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            ) : null}
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
