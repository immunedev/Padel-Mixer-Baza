'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Header from '@/components/Header';
import { calculateStandings } from '@/lib/scoring';
import { generateShareableUrl } from '@/lib/share';
import Image from 'next/image';

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { t, loadTournamentById, currentTournament } = useApp();
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    const [showAllRounds, setShowAllRounds] = useState(false);
    const [sortMode, setSortMode] = useState<'points' | 'wins'>('points');

    useEffect(() => {
        loadTournamentById(id);
    }, [id, loadTournamentById]);

    if (!currentTournament) {
        return (
            <>
                <Header />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-navy-400 text-lg">Loading...</div>
                </div>
            </>
        );
    }

    const tournament = currentTournament;
    const standings = calculateStandings(tournament);

    const getPlayerName = (pid: string) =>
        tournament.players.find((p) => p.id === pid)?.name || pid;

    // Sort standings based on selected mode
    const sortedStandings = [...standings].sort((a, b) => {
        if (sortMode === 'wins') {
            if (b.matchesWon !== a.matchesWon) return b.matchesWon - a.matchesWon;
            if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
            return b.pointDifference - a.pointDifference;
        }
        // Default: points first
        if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
        if (b.pointDifference !== a.pointDifference) return b.pointDifference - a.pointDifference;
        return b.matchesWon - a.matchesWon;
    });

    const handleShare = async () => {
        const url = generateShareableUrl(tournament);
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
            const input = document.createElement('input');
            input.value = url;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const podium = sortedStandings.slice(0, 3);
    const trophies = ['🥇', '🥈', '🥉'];
    const podiumClasses = ['podium-1', 'podium-2', 'podium-3'];

    return (
        <>
            <Header />
            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Title */}
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-3xl font-black text-white mb-2">{t.tournamentResults}</h1>
                    <h2 className="text-xl text-gold-400 font-bold">{tournament.name}</h2>
                    <div className="flex items-center justify-center gap-3 text-sm text-navy-300 mt-2">
                        <span>{tournament.rounds.length} {t.round.toLowerCase()}s</span>
                        <span>•</span>
                        <span>{tournament.players.length} {t.players.toLowerCase()}</span>
                        <span>•</span>
                        <span>{tournament.scoringSystem} pkt</span>
                    </div>
                </div>

                {/* Podium */}
                <div className="mb-10 animate-slide-up stagger-1" style={{ opacity: 0 }}>
                    <div className="flex items-end justify-center gap-4 mb-6">
                        {/* 2nd Place */}
                        {podium[1] && (
                            <div className="text-center animate-slide-up stagger-2" style={{ opacity: 0 }}>
                                <div className={`${podiumClasses[1]} rounded-2xl p-5 w-28 sm:w-36`}>
                                    <div className="text-3xl mb-1">🥈</div>
                                    <div className="font-bold text-white text-sm sm:text-base truncate">
                                        {podium[1].playerName}
                                    </div>
                                    <div className="text-lg font-black text-navy-200 mt-1">
                                        {podium[1].totalPoints}
                                    </div>
                                    <div className="text-xs text-navy-400">{t.points.toLowerCase()}</div>
                                </div>
                                <div className="h-20 bg-gradient-to-t from-transparent to-gray-400/10 rounded-b-xl mt-1 flex items-center justify-center">
                                    <span className="text-4xl font-black text-gray-400/30">2</span>
                                </div>
                            </div>
                        )}

                        {/* 1st Place */}
                        {podium[0] && (
                            <div className="text-center animate-slide-up stagger-1" style={{ opacity: 0 }}>
                                <div className={`${podiumClasses[0]} rounded-2xl p-6 w-32 sm:w-40`}>
                                    <div className="text-4xl mb-1 animate-trophy">🏆</div>
                                    <div className="text-xs uppercase tracking-wider text-gold-600 font-bold mb-1">
                                        {t.champion}
                                    </div>
                                    <div className="font-black text-white text-base sm:text-lg truncate">
                                        {podium[0].playerName}
                                    </div>
                                    <div className="text-2xl font-black text-gold-400 mt-1">
                                        {podium[0].totalPoints}
                                    </div>
                                    <div className="text-xs text-navy-400">{t.points.toLowerCase()}</div>
                                </div>
                                <div className="h-28 bg-gradient-to-t from-transparent to-yellow-400/10 rounded-b-xl mt-1 flex items-center justify-center">
                                    <span className="text-5xl font-black text-yellow-400/30">1</span>
                                </div>
                            </div>
                        )}

                        {/* 3rd Place */}
                        {podium[2] && (
                            <div className="text-center animate-slide-up stagger-3" style={{ opacity: 0 }}>
                                <div className={`${podiumClasses[2]} rounded-2xl p-5 w-28 sm:w-36`}>
                                    <div className="text-3xl mb-1">🥉</div>
                                    <div className="font-bold text-white text-sm sm:text-base truncate">
                                        {podium[2].playerName}
                                    </div>
                                    <div className="text-lg font-black text-orange-300 mt-1">
                                        {podium[2].totalPoints}
                                    </div>
                                    <div className="text-xs text-navy-400">{t.points.toLowerCase()}</div>
                                </div>
                                <div className="h-14 bg-gradient-to-t from-transparent to-orange-400/10 rounded-b-xl mt-1 flex items-center justify-center">
                                    <span className="text-3xl font-black text-orange-400/30">3</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Share Button */}
                <div className="flex justify-center mb-8 animate-fade-in stagger-2" style={{ opacity: 0 }}>
                    <button
                        onClick={handleShare}
                        className={`btn-primary flex items-center gap-2 ${copied ? 'bg-green-500' : ''}`}
                    >
                        {copied ? (
                            <>✓ {t.linkCopied}</>
                        ) : (
                            <>📋 {t.shareResults}</>
                        )}
                    </button>
                </div>

                {/* Full Standings Table */}
                <div className="mb-8 animate-slide-up stagger-3" style={{ opacity: 0 }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-navy-200">{t.finalStandings}</h3>
                        <div className="flex gap-1 bg-navy-800/50 rounded-xl p-1">
                            <button
                                onClick={() => setSortMode('points')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${sortMode === 'points'
                                    ? 'bg-gold-500 text-navy-950'
                                    : 'text-navy-300 hover:text-white'
                                    }`}
                            >
                                {t.sortByPoints}
                            </button>
                            <button
                                onClick={() => setSortMode('wins')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${sortMode === 'wins'
                                    ? 'bg-gold-500 text-navy-950'
                                    : 'text-navy-300 hover:text-white'
                                    }`}
                            >
                                {t.sortByWins}
                            </button>
                        </div>
                    </div>
                    <div className="glass-card-static overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-navy-700/50">
                                    <th className="px-4 py-3 text-left text-xs font-bold text-navy-400 uppercase">{t.position}</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-navy-400 uppercase">{t.player}</th>
                                    <th className="px-4 py-3 text-center text-xs font-bold text-navy-400 uppercase">{t.points}</th>
                                    <th className="px-4 py-3 text-center text-xs font-bold text-navy-400 uppercase">{t.played}</th>
                                    <th className="px-4 py-3 text-center text-xs font-bold text-navy-400 uppercase">{t.won}</th>
                                    <th className="px-4 py-3 text-center text-xs font-bold text-navy-400 uppercase">{t.lost}</th>
                                    <th className="px-4 py-3 text-center text-xs font-bold text-navy-400 uppercase">{t.diff}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedStandings.map((s, idx) => (
                                    <tr
                                        key={s.playerId}
                                        className={`border-b border-navy-800/30 ${idx < 3 ? 'bg-navy-800/20' : ''
                                            }`}
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`font-black text-lg ${idx < 3
                                                        ? idx === 0
                                                            ? 'position-1'
                                                            : idx === 1
                                                                ? 'position-2'
                                                                : 'position-3'
                                                        : 'text-navy-400'
                                                        }`}
                                                >
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
                                            <span
                                                className={`font-medium ${s.pointDifference > 0 ? 'text-success' : s.pointDifference < 0 ? 'text-error' : 'text-navy-400'
                                                    }`}
                                            >
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
                <div className="mb-8 animate-slide-up stagger-4" style={{ opacity: 0 }}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-navy-200">{t.matchHistory}</h3>
                        <button
                            onClick={() => setShowAllRounds(!showAllRounds)}
                            className="btn-ghost text-sm"
                        >
                            {showAllRounds ? '▲ Collapse' : '▼ Expand'}
                        </button>
                    </div>

                    {(showAllRounds ? tournament.rounds : tournament.rounds.slice(0, 3)).map((round) => (
                        <div key={round.id} className="mb-4">
                            <h4 className="text-xs font-bold text-navy-500 uppercase tracking-wider mb-2">
                                {t.round} {round.number}
                            </h4>
                            <div className="space-y-2">
                                {round.matches.map((match) => (
                                    <div
                                        key={match.id}
                                        className="rounded-xl bg-navy-900/50 border border-navy-800/50 p-3"
                                    >
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="text-xs text-navy-500 w-12">{t.court} {match.court}</span>
                                            <div className="flex-1 text-right text-navy-200">
                                                {match.team1.playerIds.map(getPlayerName).join(' & ')}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span
                                                    className={`font-bold tabular-nums ${(match.score1 ?? 0) > (match.score2 ?? 0) ? 'text-success' : 'text-white'
                                                        }`}
                                                >
                                                    {match.score1}
                                                </span>
                                                <span className="text-navy-500">:</span>
                                                <span
                                                    className={`font-bold tabular-nums ${(match.score2 ?? 0) > (match.score1 ?? 0) ? 'text-success' : 'text-white'
                                                        }`}
                                                >
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

                {/* Footer with logo */}
                <div className="text-center py-8 border-t border-navy-800/50 mt-8">
                    <div className="w-12 h-12 mx-auto rounded-xl overflow-hidden bg-white/5 p-2 mb-2 opacity-40">
                        <Image src="/logo.jpg" alt="Logo" width={48} height={48} className="w-full h-full object-contain" />
                    </div>
                    <p className="text-xs text-navy-500">Baza Padel Club</p>
                </div>

                {/* Repeat & Back buttons */}
                <div className="flex flex-col items-center gap-3 mt-4 mb-8">
                    <button
                        onClick={() => {
                            const repeatSettings = {
                                name: tournament.name,
                                format: tournament.format,
                                scoringSystem: tournament.scoringSystem,
                                courts: tournament.courts,
                                players: tournament.players,
                                teams: tournament.teams || [],
                                roundMode: tournament.roundMode || 'fixed',
                            };
                            localStorage.setItem('padel_repeat_settings', JSON.stringify(repeatSettings));
                            router.push('/tournament/new?repeat=1');
                        }}
                        className="btn-primary w-full max-w-sm text-lg"
                    >
                        {t.repeatTournament}
                    </button>
                    <p className="text-xs text-navy-400">{t.repeatTournamentDesc}</p>
                    <button onClick={() => router.push('/')} className="btn-ghost mt-2">
                        ← {t.backToHome}
                    </button>
                </div>
            </main>
        </>
    );
}
