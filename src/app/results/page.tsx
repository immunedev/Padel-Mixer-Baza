'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { parseShareableData } from '@/lib/share';
import { calculateStandings } from '@/lib/scoring';
import { Tournament, PlayerStats } from '@/lib/types';
import Image from 'next/image';

function SharedResultsContent() {
    const searchParams = useSearchParams();
    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [standings, setStandings] = useState<PlayerStats[]>([]);
    const [error, setError] = useState(false);
    const [showAllRounds, setShowAllRounds] = useState(false);

    useEffect(() => {
        const data = searchParams.get('data');
        if (data) {
            const t = parseShareableData(data);
            if (t) {
                setTournament(t);
                setStandings(calculateStandings(t));
            } else {
                setError(true);
            }
        } else {
            setError(true);
        }
    }, [searchParams]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-5xl mb-4">😕</div>
                    <h1 className="text-2xl font-bold text-white mb-2">Nie znaleziono wyników</h1>
                    <p className="text-navy-300">Invalid or expired results link.</p>
                </div>
            </div>
        );
    }

    if (!tournament) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-navy-400 text-lg">Loading...</div>
            </div>
        );
    }

    const getPlayerName = (pid: string) =>
        tournament.players.find((p) => p.id === pid)?.name || pid;

    const podium = standings.slice(0, 3);
    const trophies = ['🥇', '🥈', '🥉'];
    const podiumClasses = ['podium-1', 'podium-2', 'podium-3'];

    return (
        <div className="min-h-screen">
            <div className="court-bg" />
            <div className="relative z-10">
                {/* Header */}
                <header className="sticky top-0 z-50 backdrop-blur-xl bg-navy-950/80 border-b border-navy-700/30">
                    <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-center gap-3">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/10 p-1">
                            <Image src="/logo.svg" alt="Logo" width={32} height={32} className="w-full h-full object-contain" />
                        </div>
                        <span className="text-lg font-bold bg-gradient-to-r from-gold-400 to-gold-500 bg-clip-text text-transparent">
                            Baza Padel Tournament
                        </span>
                    </div>
                </header>

                <main className="max-w-4xl mx-auto px-4 py-8">
                    {/* Title */}
                    <div className="text-center mb-8 animate-fade-in">
                        <h1 className="text-3xl font-black text-white mb-2">Wyniki turnieju</h1>
                        <h2 className="text-xl text-gold-400 font-bold">{tournament.name}</h2>
                        <div className="flex items-center justify-center gap-3 text-sm text-navy-300 mt-2">
                            <span>{tournament.rounds.length} rund</span>
                            <span>•</span>
                            <span>{tournament.players.length} graczy</span>
                            <span>•</span>
                            <span>{tournament.scoringSystem} pkt</span>
                        </div>
                    </div>

                    {/* Podium */}
                    <div className="mb-10 animate-slide-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
                        <div className="flex items-end justify-center gap-4 mb-6">
                            {/* 2nd */}
                            {podium[1] && (
                                <div className="text-center">
                                    <div className={`${podiumClasses[1]} rounded-2xl p-5 w-28 sm:w-36`}>
                                        <div className="text-3xl mb-1">🥈</div>
                                        <div className="font-bold text-white text-sm sm:text-base truncate">{podium[1].playerName}</div>
                                        <div className="text-lg font-black text-navy-200 mt-1">{podium[1].totalPoints}</div>
                                        <div className="text-xs text-navy-400">punkty</div>
                                    </div>
                                    <div className="h-20 bg-gradient-to-t from-transparent to-gray-400/10 rounded-b-xl mt-1 flex items-center justify-center">
                                        <span className="text-4xl font-black text-gray-400/30">2</span>
                                    </div>
                                </div>
                            )}
                            {/* 1st */}
                            {podium[0] && (
                                <div className="text-center">
                                    <div className={`${podiumClasses[0]} rounded-2xl p-6 w-32 sm:w-40`}>
                                        <div className="text-4xl mb-1 animate-trophy">🏆</div>
                                        <div className="text-xs uppercase tracking-wider text-gold-600 font-bold mb-1">Mistrz</div>
                                        <div className="font-black text-white text-base sm:text-lg truncate">{podium[0].playerName}</div>
                                        <div className="text-2xl font-black text-gold-400 mt-1">{podium[0].totalPoints}</div>
                                        <div className="text-xs text-navy-400">punkty</div>
                                    </div>
                                    <div className="h-28 bg-gradient-to-t from-transparent to-yellow-400/10 rounded-b-xl mt-1 flex items-center justify-center">
                                        <span className="text-5xl font-black text-yellow-400/30">1</span>
                                    </div>
                                </div>
                            )}
                            {/* 3rd */}
                            {podium[2] && (
                                <div className="text-center">
                                    <div className={`${podiumClasses[2]} rounded-2xl p-5 w-28 sm:w-36`}>
                                        <div className="text-3xl mb-1">🥉</div>
                                        <div className="font-bold text-white text-sm sm:text-base truncate">{podium[2].playerName}</div>
                                        <div className="text-lg font-black text-orange-300 mt-1">{podium[2].totalPoints}</div>
                                        <div className="text-xs text-navy-400">punkty</div>
                                    </div>
                                    <div className="h-14 bg-gradient-to-t from-transparent to-orange-400/10 rounded-b-xl mt-1 flex items-center justify-center">
                                        <span className="text-3xl font-black text-orange-400/30">3</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Full Standings */}
                    <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
                        <h3 className="text-lg font-bold text-navy-200 mb-4">Klasyfikacja końcowa</h3>
                        <div className="glass-card-static overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-navy-700/50">
                                        <th className="px-4 py-3 text-left text-xs font-bold text-navy-400 uppercase">Poz.</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-navy-400 uppercase">Gracz</th>
                                        <th className="px-4 py-3 text-center text-xs font-bold text-navy-400 uppercase">Punkty</th>
                                        <th className="px-4 py-3 text-center text-xs font-bold text-navy-400 uppercase">Mecze</th>
                                        <th className="px-4 py-3 text-center text-xs font-bold text-navy-400 uppercase">W</th>
                                        <th className="px-4 py-3 text-center text-xs font-bold text-navy-400 uppercase">P</th>
                                        <th className="px-4 py-3 text-center text-xs font-bold text-navy-400 uppercase">+/-</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {standings.map((s, idx) => (
                                        <tr key={s.playerId} className={`border-b border-navy-800/30 ${idx < 3 ? 'bg-navy-800/20' : ''}`}>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-black text-lg ${idx === 0 ? 'position-1' : idx === 1 ? 'position-2' : idx === 2 ? 'position-3' : 'text-navy-400'}`}>
                                                        {idx + 1}
                                                    </span>
                                                    {idx < 3 && <span>{trophies[idx]}</span>}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-medium text-white">{s.playerName}</td>
                                            <td className="px-4 py-3 text-center font-bold text-gold-400">{s.totalPoints}</td>
                                            <td className="px-4 py-3 text-center text-navy-300">{s.matchesPlayed}</td>
                                            <td className="px-4 py-3 text-center text-navy-300">{s.matchesWon}</td>
                                            <td className="px-4 py-3 text-center text-navy-300">{s.matchesLost}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`font-medium ${s.pointDifference > 0 ? 'text-success' : s.pointDifference < 0 ? 'text-error' : 'text-navy-400'}`}>
                                                    {s.pointDifference > 0 ? '+' : ''}{s.pointDifference}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Match History */}
                    <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-navy-200">Historia meczy</h3>
                            <button onClick={() => setShowAllRounds(!showAllRounds)} className="btn-ghost text-sm">
                                {showAllRounds ? '▲' : '▼ Pokaż wszystkie'}
                            </button>
                        </div>

                        {(showAllRounds ? tournament.rounds : tournament.rounds.slice(0, 3)).map((round) => (
                            <div key={round.id} className="mb-4">
                                <h4 className="text-xs font-bold text-navy-500 uppercase tracking-wider mb-2">Runda {round.number}</h4>
                                <div className="space-y-2">
                                    {round.matches.map((match) => (
                                        <div key={match.id} className="rounded-xl bg-navy-900/50 border border-navy-800/50 p-3">
                                            <div className="flex items-center gap-3 text-sm">
                                                <span className="text-xs text-navy-500 w-12">Kort {match.court}</span>
                                                <div className="flex-1 text-right text-navy-200">
                                                    {match.team1.playerIds.map(getPlayerName).join(' & ')}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className={`font-bold tabular-nums ${(match.score1 ?? 0) > (match.score2 ?? 0) ? 'text-success' : 'text-white'}`}>
                                                        {match.score1}
                                                    </span>
                                                    <span className="text-navy-500">:</span>
                                                    <span className={`font-bold tabular-nums ${(match.score2 ?? 0) > (match.score1 ?? 0) ? 'text-success' : 'text-white'}`}>
                                                        {match.score2}
                                                    </span>
                                                </div>
                                                <div className="flex-1 text-left text-navy-200">
                                                    {match.team2.playerIds.map(getPlayerName).join(' & ')}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="text-center py-8 border-t border-navy-800/50 mt-8">
                        <div className="w-12 h-12 mx-auto rounded-xl overflow-hidden bg-white/5 p-2 mb-2 opacity-40">
                            <Image src="/logo.svg" alt="Logo" width={48} height={48} className="w-full h-full object-contain" />
                        </div>
                        <p className="text-xs text-navy-500">Padel Mixer</p>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function SharedResultsPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-navy-400 text-lg">Loading...</div>
                </div>
            }
        >
            <SharedResultsContent />
        </Suspense>
    );
}
