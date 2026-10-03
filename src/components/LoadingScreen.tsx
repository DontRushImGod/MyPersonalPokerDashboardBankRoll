import { useState, useEffect } from 'react';

const messages = [
  'Shuffling the deck...',
  'Counting chips...',
  'Raking the pot...',
  'Checking the flop...',
  'Stacking the blinds...',
  'Dealing the river...',
  'Reading the table...',
  'Anteing up...',
  'Looking for tells...',
  'Going all in on loading...',
  'Folding the old state...',
  'Raising the stakes...',
];

const suits = ['♠', '♥', '♦', '♣'];
const suitColors: Record<string, string> = {
  '♠': 'text-ink-900',
  '♥': 'text-red-500',
  '♦': 'text-red-500',
  '♣': 'text-ink-900',
};

export function LoadingScreen({ message }: { message?: string }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [cards, setCards] = useState<{ id: number; suit: string; rank: string; delay: number; left: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(i => (i + 1) % messages.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const ranks = ['A', 'K', 'Q', 'J', '10'];
    const newCards = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      suit: suits[i % 4],
      rank: ranks[i % ranks.length],
      delay: i * 0.3,
      left: 8 + i * 16,
    }));
    setCards(newCards);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative" style={{ background: 'radial-gradient(ellipse at center, #143b33 0%, #080d16 100%)' }}>
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(45, 142, 117, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 30%, rgba(245, 158, 11, 0.08) 0%, transparent 50%)' }} />

      {cards.map(card => (
        <div
          key={card.id}
          className="absolute"
          style={{
            left: `${card.left}%`,
            bottom: '-15%',
            animation: `floatUp 4s ease-in-out infinite`,
            animationDelay: `${card.delay}s`,
          }}
        >
          <div
            className="w-14 h-20 rounded-lg bg-gradient-to-br from-white to-ink-100 shadow-2xl flex flex-col items-center justify-center"
            style={{ animation: `cardSpin 3s ease-in-out infinite`, animationDelay: `${card.delay}s` }}
          >
            <span className={`text-2xl font-bold ${suitColors[card.suit]}`}>{card.rank}</span>
            <span className={`text-xl ${suitColors[card.suit]}`}>{card.suit}</span>
          </div>
        </div>
      ))}

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-32 h-32 mb-8">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className="absolute left-1/2 rounded-full"
              style={{
                width: '96px',
                height: '96px',
                top: `${i * 8}px`,
                transform: 'translateX(-50%)',
                animation: `chipBounce 1.2s ease-in-out infinite`,
                animationDelay: `${i * 0.15}s`,
              }}
            >
              <div
                className="w-full h-full rounded-full border-4 flex items-center justify-center"
                style={{
                  background: i % 2 === 0
                    ? 'linear-gradient(135deg, #2d8e75, #1f725c)'
                    : 'linear-gradient(135deg, #334155, #1e293b)',
                  borderColor: i % 2 === 0 ? '#84c9b4' : '#64748b',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                }}
              >
                <div
                  className="absolute inset-2 rounded-full border-2 border-dashed"
                  style={{ borderColor: i % 2 === 0 ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)' }}
                />
                <span className="text-white text-xs font-bold relative z-10">
                  {i === 0 ? '100' : i === 1 ? '50' : i === 2 ? '25' : '10'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="h-8 overflow-hidden">
          <p
            key={msgIndex}
            className="text-accent-400 font-semibold text-lg tracking-wide"
            style={{ animation: 'msgSlide 0.4s ease-out' }}
          >
            {message || messages[msgIndex]}
          </p>
        </div>

        <div className="flex gap-2 mt-4">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-accent-400"
              style={{ animation: `dotPulse 1.4s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          15% { opacity: 0.5; }
          85% { opacity: 0.5; }
          100% { transform: translateY(-120vh) rotate(360deg); opacity: 0; }
        }
        @keyframes cardSpin {
          0%, 100% { transform: rotateY(0deg); }
          50% { transform: rotateY(180deg); }
        }
        @keyframes chipBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-12px); }
        }
        @keyframes msgSlide {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
