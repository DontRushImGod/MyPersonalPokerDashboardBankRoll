import { PokerSession } from '../lib/supabase';
import { Trash2, Calendar, Clock, StickyNote, X } from 'lucide-react';
import { useState } from 'react';

interface SessionHistoryProps {
  sessions: PokerSession[];
  onDelete: (id: string) => Promise<boolean>;
}

export function SessionHistory({ sessions, onDelete }: SessionHistoryProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [noteSession, setNoteSession] = useState<PokerSession | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this session?')) {
      setDeletingId(id);
      await onDelete(id);
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (sessions.length === 0) {
    return (
      <div className="bg-white dark:bg-ink-900 rounded-xl p-12 border border-ink-200 dark:border-ink-800 text-center">
        <p className="text-ink-500 dark:text-ink-400 text-lg">
          No sessions recorded yet. Click the + button to add your first session!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-ink-200 dark:border-ink-800">
        <h3 className="text-lg font-bold text-ink-900 dark:text-white">Session History</h3>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full">
          <thead className="bg-ink-50 dark:bg-ink-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider">
                Game Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider">
                Stakes
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider">
                Site
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider">
                Buy-in
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider">
                Cash-out
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider">
                Profit
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider">
                Notes
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-ink-500 dark:text-ink-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-200 dark:divide-ink-800">
            {sessions.map((session) => {
              const profit = parseFloat(session.profit.toString());
              return (
                <tr
                  key={session.id}
                  className="hover:bg-ink-50 dark:hover:bg-ink-800/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-ink-900 dark:text-white">
                      <Calendar className="w-4 h-4 text-ink-400 flex-shrink-0" />
                      {formatDate(session.session_date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-felt-100 dark:bg-felt-900/30 text-felt-700 dark:text-felt-400">
                      {session.game_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-900 dark:text-white font-mono">
                    {session.stakes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-900 dark:text-white">
                    {session.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-ink-600 dark:text-ink-300 font-mono">
                    ${parseFloat(session.buy_in.toString()).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-ink-600 dark:text-ink-300 font-mono">
                    ${parseFloat(session.cash_out.toString()).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span
                      className={`font-bold font-mono ${
                        profit >= 0
                          ? 'text-felt-600 dark:text-felt-400'
                          : 'text-red-500 dark:text-red-400'
                      }`}
                    >
                      {profit >= 0 ? '+' : ''}${profit.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1 text-sm text-ink-600 dark:text-ink-400">
                      <Clock className="w-4 h-4" />
                      {formatDuration(session.duration)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {session.notes ? (
                      <button
                        onClick={() => setNoteSession(session)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 hover:bg-accent-200 dark:hover:bg-accent-900/50 transition-colors"
                        title="View notes"
                      >
                        <StickyNote className="w-3.5 h-3.5" />
                        View
                      </button>
                    ) : (
                      <span className="text-xs text-ink-300 dark:text-ink-700">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleDelete(session.id)}
                      disabled={deletingId === session.id}
                      className="text-ink-400 hover:text-red-500 dark:text-ink-500 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                      title="Delete session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {noteSession && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setNoteSession(null)}
        >
          <div
            className="bg-white dark:bg-ink-900 rounded-xl shadow-felt-lg max-w-lg w-full max-h-[80vh] overflow-y-auto scrollbar-thin"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-ink-200 dark:border-ink-800">
              <div className="flex items-center gap-2">
                <StickyNote className="w-5 h-5 text-accent-600 dark:text-accent-400" />
                <h3 className="text-lg font-bold text-ink-900 dark:text-white">Session Notes</h3>
              </div>
              <button
                onClick={() => setNoteSession(null)}
                className="text-ink-400 hover:text-ink-600 dark:hover:text-ink-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-felt-100 dark:bg-felt-900/30 text-felt-700 dark:text-felt-400">
                  {noteSession.game_type}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 font-mono">
                  {noteSession.stakes}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300">
                  {noteSession.location}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300">
                  {formatDate(noteSession.session_date)}
                </span>
              </div>
              <p className="text-sm text-ink-700 dark:text-ink-300 whitespace-pre-wrap leading-relaxed">
                {noteSession.notes}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
