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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'finished'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 5;

  const sortedTournaments = [...tournaments].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  // Apply search and filter
  const filteredTournaments = sortedTournaments.filter((t_item) => {
    const matchesSearch = searchQuery === '' || t_item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t_item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredTournaments.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedTournaments = filteredTournaments.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE
  );

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleFilterChange = (filter: 'all' | 'active' | 'finished') => {
    setStatusFilter(filter);
    setCurrentPage(1);
  };

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
      <main className="max-w-5xl mx-auto px-4 py-8 min-h-[calc(100vh-64px)] flex flex-col items-center justify-center">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="relative inline-block mb-6">
            <Image
              src="/baza-padel-logo.png"
              alt="Baza Padel Club"
              width={280}
              height={80}
              className="mx-auto object-contain"
              priority
            />
          </div>
          <p className="text-navy-300 text-lg max-w-md mx-auto">
            Americano • Mexicano • Mixed • Team
          </p>
        </div>

        {/* New Tournament CTA */}
        <div className="flex justify-center mb-10 animate-slide-up stagger-1" style={{ opacity: 0 }}>
          <button
            onClick={() => router.push('/tournament/new')}
            className="btn-primary text-lg px-10 py-4 flex items-center gap-3"
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
          <div className="w-full animate-slide-up stagger-2" style={{ opacity: 0 }}>
            <h2 className="text-xl font-bold mb-4 text-navy-200">{t.savedTournaments}</h2>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={t.searchTournaments}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-800/60 border border-navy-700/50 text-white placeholder-navy-400 text-sm focus:outline-none focus:border-gold-500/50 transition-colors"
                />
              </div>
              <div className="flex gap-1 bg-navy-800/50 rounded-xl p-1 self-start">
                {(['all', 'active', 'finished'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => handleFilterChange(filter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === filter
                      ? 'bg-gold-500 text-navy-950'
                      : 'text-navy-300 hover:text-white'
                      }`}
                  >
                    {filter === 'all' ? t.filterAll : filter === 'active' ? t.filterActive : t.filterFinished}
                  </button>
                ))}
              </div>
            </div>

            {/* Tournament Cards */}
            <div className="space-y-3">
              {paginatedTournaments.map((tournament, index) => (
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

            {/* Empty filter results */}
            {filteredTournaments.length === 0 && (
              <div className="text-center text-navy-400 py-8">
                <p>{t.noTournaments}</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safeCurrentPage <= 1}
                  className="btn-secondary py-2 px-4 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ← {t.previousPage}
                </button>
                <span className="text-sm text-navy-300 tabular-nums">
                  {safeCurrentPage} {t.pageOf} {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safeCurrentPage >= totalPages}
                  className="btn-secondary py-2 px-4 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {t.nextPage} →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {sortedTournaments.length === 0 && (
          <div className="text-center text-navy-400 py-12 animate-fade-in stagger-2" style={{ opacity: 0 }}>
            <p className="text-lg">{t.noTournaments}</p>
          </div>
        )}
      </main>
    </>
  );
}
