import { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface SessionFormProps {
  onSubmit: (session: SessionFormData) => Promise<boolean>;
}

export interface SessionFormData {
  buy_in: number;
  cash_out: number;
  game_type: string;
  stakes: string;
  duration: number;
  location: string;
  notes: string;
  session_date: string;
}

const GAME_TYPES = ['Cash Game', 'PLO', 'PKO Tournament', 'nPKO Tournament', 'MTT', 'Sit & Go'];
const SITES = ['GGPoker', 'PokerStars', 'CoinPoker', 'WPTGlobal', 'ClubGG', 'Other'];

function getLocalDateTimeNow(): string {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

const inputClass = "w-full px-3.5 py-2.5 border border-ink-300 dark:border-ink-700 rounded-lg bg-ink-50 dark:bg-ink-800 text-ink-900 dark:text-white focus:ring-2 focus:ring-felt-500 focus:border-transparent transition-all outline-none";
const labelClass = "block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5";

export function SessionForm({ onSubmit }: SessionFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<SessionFormData>({
    buy_in: 0,
    cash_out: 0,
    game_type: 'Cash Game',
    stakes: '',
    duration: 0,
    location: 'GGPoker',
    notes: '',
    session_date: getLocalDateTimeNow(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(formData);
    if (success) {
      setFormData({
        buy_in: 0,
        cash_out: 0,
        game_type: 'Cash Game',
        stakes: '',
        duration: 0,
        location: 'GGPoker',
        notes: '',
        session_date: getLocalDateTimeNow(),
      });
      setIsOpen(false);
    }
  };

  const profit = formData.cash_out - formData.buy_in;

  return (
    <>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 bg-felt-600 hover:bg-felt-700 text-white p-4 rounded-xl shadow-felt-lg transition-all duration-200 hover:scale-105 z-50"
          title="Add new session"
        >
          <Plus size={26} />
        </button>
      ) : (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white dark:bg-ink-900 rounded-2xl shadow-felt-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-ink-200 dark:border-ink-800">
              <h2 className="text-xl font-bold text-ink-900 dark:text-white">New Poker Session</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-ink-400 hover:text-ink-600 dark:hover:text-ink-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Buy-in ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.buy_in || ''}
                      onChange={(e) => setFormData({ ...formData, buy_in: parseFloat(e.target.value) || 0 })}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Cash-out ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.cash_out || ''}
                      onChange={(e) => setFormData({ ...formData, cash_out: parseFloat(e.target.value) || 0 })}
                      className={inputClass}
                    />
                  </div>
                </div>

                {(formData.buy_in > 0 || formData.cash_out > 0) && (
                  <div className={`p-3 rounded-lg ${profit >= 0 ? 'bg-felt-50 dark:bg-felt-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                    <span className={`font-semibold ${profit >= 0 ? 'text-felt-700 dark:text-felt-400' : 'text-red-600 dark:text-red-400'}`}>
                      Profit: ${profit.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Game Type</label>
                    <select
                      value={formData.game_type}
                      onChange={(e) => setFormData({ ...formData, game_type: e.target.value })}
                      className={inputClass}
                    >
                      {GAME_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Stakes</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., 0.25/0.50"
                      value={formData.stakes}
                      onChange={(e) => setFormData({ ...formData, stakes: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Duration (minutes)</label>
                    <input
                      type="number"
                      required
                      value={formData.duration || ''}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Site</label>
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className={inputClass}
                    >
                      {SITES.map(site => (
                        <option key={site} value={site}>{site}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.session_date}
                    onChange={(e) => setFormData({ ...formData, session_date: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Notes (optional)</label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className={inputClass}
                    placeholder="Any notes about this session..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-felt-600 hover:bg-felt-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors"
                  >
                    Add Session
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 bg-ink-100 hover:bg-ink-200 dark:bg-ink-800 dark:hover:bg-ink-700 text-ink-700 dark:text-ink-200 py-2.5 px-4 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
