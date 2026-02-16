'use client';

import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Image from 'next/image';
import { useState } from 'react';

const formatIcons: Record<string, string> = {
  americano: '🎾',
  mixedAmericano: '👫',
  teamAmericano: '👥',
  mexicano: '🌮',
  teamMexicano: '🏆',
};

export default function HomePage() {
  const { t, tournaments, dispatch } = useApp();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const sortedTournaments = [...tournaments].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_TOURNAMENT', id });
    setDeletingId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="badge badge-live">LIVE</span>;
      case 'finished':
        return <span className="badge badge-completed">✓</span>;
      default:
        return <span className="badge badge-setup">⚙</span>;
    }
  };

  const getFormatLabel = (format: string) => {
    const key = `format${format.charAt(0).toUpperCase() + format.slice(1)}` as keyof typeof t;
    return (t[key] as string) || format;
  };

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="relative inline-block mb-6">

          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-white via-navy-100 to-navy-200 bg-clip-text text-transparent">
            {t.appName}
          </h1>
          <p className="text-navy-300 text-lg max-w-md mx-auto">
            Americano • Mexicano • Mixed • Team
          </p>
        </div>

        {/* New Tournament CTA */}
        <div className="flex justify-center mb-10 animate-slide-up stagger-1" style={{ opacity: 0 }}>
          <button
            onClick={() => router.push('/tournament/new')}
            className="btn-primary text-lg px-10 py-4 animate-glow flex items-center gap-3"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="10" y1="4" x2="10" y2="16" />
              <line x1="4" y1="10" x2="16" y2="10" />
            </svg>
            {t.newTournament}
          </button>
        </div>

        {/* Tournament List */}
        {sortedTournaments.length > 0 && (
          <div className="animate-slide-up stagger-2" style={{ opacity: 0 }}>
            <h2 className="text-xl font-bold mb-4 text-navy-200">{t.savedTournaments}</h2>
            <div className="space-y-3">
              {sortedTournaments.map((tournament, index) => (
                <div
                  key={tournament.id}
                  className="glass-card p-4 cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center gap-4 flex-1"
                      onClick={() =>
                        tournament.status === 'finished'
                          ? router.push(`/tournament/${tournament.id}/results`)
                          : router.push(`/tournament/${tournament.id}`)
                      }
                    >
                      <div className="text-2xl">{formatIcons[tournament.format]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-white truncate">{tournament.name}</h3>
                          {getStatusBadge(tournament.status)}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-navy-300">
                          <span>{getFormatLabel(tournament.format)}</span>
                          <span>•</span>
                          <span>{tournament.players.length} {t.players.toLowerCase()}</span>
                          <span>•</span>
                          <span>{tournament.courts} {t.courts.toLowerCase()}</span>
                          <span>•</span>
                          <span>{tournament.scoringSystem} pkt</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {tournament.status === 'active' && (
                        <button
                          onClick={() => router.push(`/tournament/${tournament.id}`)}
                          className="btn-secondary py-2 px-4 text-sm"
                        >
                          {t.continueTournament}
                        </button>
                      )}
                      {deletingId === tournament.id ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDelete(tournament.id)}
                            className="btn-danger py-2 px-3 text-xs"
                          >
                            {t.confirm}
                          </button>
                          <button
                            onClick={() => setDeletingId(null)}
                            className="btn-ghost py-2 px-3 text-xs"
                          >
                            {t.cancel}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeletingId(tournament.id)}
                          className="btn-ghost py-2 px-3 text-sm text-red-400 hover:text-red-300"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {sortedTournaments.length === 0 && (
          <div className="text-center text-navy-400 py-12 animate-fade-in stagger-2" style={{ opacity: 0 }}>
            <div className="text-5xl mb-4">🏓</div>
            <p className="text-lg">{t.noTournaments}</p>
          </div>
        )}
      </main>
    </>
  );
}
