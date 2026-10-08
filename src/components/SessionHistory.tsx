import { PokerSession } from '../lib/supabase';
import { Trash2, Calendar, Clock, StickyNote, X, DollarSign, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface SessionHistoryProps {
  sessions: PokerSession[];
  onDelete: (id: string) => Promise<boolean>;
}

export function SessionHistory({ sessions, onDelete }: SessionHistoryProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<PokerSession | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setConfirmDelete(null);
    await onDelete(id);
    setDeletingId(null);
    setSelectedSession(null);
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
      <div className="bg-white dark:bg-gray-800 rounded-lg p-12 border border-gray-200 dark:border-gray-700 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No sessions recorded yet. Click the + button to add your first session!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Session History</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Click any session to view full details and notes</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Game Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Stakes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Site
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Buy-in
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Cash-out
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Profit
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Notes
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sessions.map((session) => {
              const profit = parseFloat(session.profit.toString());
              const hasNotes = session.notes && session.notes.trim().length > 0;
              return (
                <tr
                  key={session.id}
                  onClick={() => setSelectedSession(session)}
                  className="hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                      <Calendar className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      {formatDate(session.session_date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                      {session.game_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {session.stakes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {session.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                    ${parseFloat(session.buy_in.toString()).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                    ${parseFloat(session.cash_out.toString()).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span
                      className={`font-semibold ${
                        profit >= 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {profit >= 0 ? '+' : ''}${profit.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      {formatDuration(session.duration)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {hasNotes ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                        <StickyNote className="w-3.5 h-3.5" />
                        View
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 dark:text-gray-600">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDelete(session.id);
                      }}
                      disabled={deletingId === session.id}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors disabled:opacity-50"
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

      {selectedSession && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
          onClick={() => setSelectedSession(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Session Details</h3>
              <button
                onClick={() => setSelectedSession(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                  {selectedSession.game_type}
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {selectedSession.stakes}
                </span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {selectedSession.location}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Date & Time</span>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white">{formatDate(selectedSession.session_date)}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Duration</span>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white">{formatDuration(selectedSession.duration)}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Buy-in</span>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white">${parseFloat(selectedSession.buy_in.toString()).toFixed(2)}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Cash-out</span>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white">${parseFloat(selectedSession.cash_out.toString()).toFixed(2)}</p>
                </div>
              </div>

              <div className={`rounded-lg p-4 ${parseFloat(selectedSession.profit.toString()) >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Profit</span>
                </div>
                <p className={`text-2xl font-bold ${parseFloat(selectedSession.profit.toString()) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {parseFloat(selectedSession.profit.toString()) >= 0 ? '+' : ''}${parseFloat(selectedSession.profit.toString()).toFixed(2)}
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <StickyNote className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Notes</span>
                </div>
                {selectedSession.notes && selectedSession.notes.trim().length > 0 ? (
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {selectedSession.notes}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 dark:text-gray-600 italic">No notes for this session</p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setConfirmDelete(selectedSession.id);
                  }}
                  disabled={deletingId === selectedSession.id}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 py-2.5 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Session?</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                This action cannot be undone. The session will be permanently removed from your history.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  disabled={deletingId !== null}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2.5 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  disabled={deletingId !== null}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deletingId !== null ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
