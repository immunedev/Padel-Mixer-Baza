'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Header from '@/components/Header';
import { calculateStandings } from '@/lib/scoring';
import { isScoreValid } from '@/lib/scoring';
import { Match, PlayerStats } from '@/lib/types';

type Tab = 'matches' | 'leaderboard' | 'stats';

export default function ActiveTournamentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { t, loadTournamentById, currentTournament, dispatch } = useApp();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('matches');
    const [editingMatch, setEditingMatch] = useState<string | null>(null);
    const [tempScore1, setTempScore1] = useState(0);
    const [tempScore2, setTempScore2] = useState(0);
    const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

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
    const currentRound = tournament.rounds[tournament.currentRound - 1];
    const isCurrentRoundComplete = currentRound?.matches.every(
        (m) => m.status === 'completed'
    );
    const hasMoreRounds =
        tournament.format === 'mexicano' || tournament.format === 'teamMexicano'
            ? true // Mexicano can always generate more rounds
            : tournament.currentRound < tournament.rounds.length;

    const getPlayerName = (playerId: string) =>
        tournament.players.find((p) => p.id === playerId)?.name || playerId;

    const startEditing = (match: Match) => {
        setEditingMatch(match.id);
        setTempScore1(match.score1 ?? 0);
        setTempScore2(match.score2 ?? Math.max(0, tournament.scoringSystem - (match.score1 ?? 0)));
    };

    const handleScore1Change = (val: number) => {
        const s1 = Math.max(0, Math.min(tournament.scoringSystem, val));
        setTempScore1(s1);
        setTempScore2(tournament.scoringSystem - s1);
    };

    const handleScore2Change = (val: number) => {
        const s2 = Math.max(0, Math.min(tournament.scoringSystem, val));
        setTempScore2(s2);
        setTempScore1(tournament.scoringSystem - s2);
    };

    const saveScore = () => {
        if (editingMatch && isScoreValid(tempScore1, tempScore2, tournament.scoringSystem)) {
            dispatch({
                type: 'UPDATE_SCORE',
                matchId: editingMatch,
                score1: tempScore1,
                score2: tempScore2,
            });
            setEditingMatch(null);
        }
    };

    const handleNextRound = () => {
        dispatch({ type: 'NEXT_ROUND' });
    };

    const handleFinish = () => {
        dispatch({ type: 'FINISH_TOURNAMENT' });
        router.push(`/tournament/${tournament.id}/results`);
    };

    return (
        <>
            <Header />
            <main className="max-w-4xl mx-auto px-4 py-6">
                {/* Tournament Header */}
                <div className="text-center mb-6 animate-fade-in">
                    <h1 className="text-2xl font-bold text-white mb-1">{tournament.name}</h1>
                    <div className="flex items-center justify-center gap-3 text-sm text-navy-300">
                        <span className="badge badge-live">LIVE</span>
                        <span>{t.round} {tournament.currentRound} {t.roundOf} {tournament.rounds.length}</span>
                        <span>•</span>
                        <span>{tournament.scoringSystem} pkt</span>
                    </div>
                </div>

                {/* Tab Bar */}
                <div className="tab-bar mb-6">
                    <button
                        className={`tab ${activeTab === 'matches' ? 'active' : ''}`}
                        onClick={() => setActiveTab('matches')}
                    >
                        🎾 {t.matches}
                    </button>
                    <button
                        className={`tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('leaderboard')}
                    >
                        🏆 {t.leaderboard}
                    </button>
                    <button
                        className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
                        onClick={() => setActiveTab('stats')}
                    >
                        📊 {t.stats}
                    </button>
                </div>

                {/* ── Matches Tab ── */}
                {activeTab === 'matches' && (
                    <div className="animate-fade-in">
                        {/* Current Round */}
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-navy-300 uppercase tracking-wider mb-3">
                                {t.round} {tournament.currentRound}
                            </h3>

                            <div className="space-y-3">
                                {currentRound?.matches.map((match, idx) => (
                                    <div
                                        key={match.id}
                                        className="glass-card-static p-4 animate-fade-in"
                                        style={{ animationDelay: `${idx * 0.05}s`, opacity: 0 }}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-medium text-navy-400 uppercase">
                                                {t.court} {match.court}
                                            </span>
                                            {match.status === 'completed' && (
                                                <span className="text-xs text-success font-medium">✓</span>
                                            )}
                                        </div>

                                        {editingMatch === match.id ? (
                                            /* Score Editing Mode */
                                            <div>
                                                <div className="flex items-center gap-4 justify-center my-3">
                                                    {/* Team 1 */}
                                                    <div className="flex-1 text-right">
                                                        <div className="text-sm font-medium text-navy-200 mb-2">
                                                            {match.team1.playerIds.map(getPlayerName).join(' & ')}
                                                        </div>
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleScore1Change(tempScore1 - 1)}
                                                                className="score-btn score-btn-minus"
                                                            >
                                                                −
                                                            </button>
                                                            <span className="text-3xl font-black text-white w-14 text-center tabular-nums">
                                                                {tempScore1}
                                                            </span>
                                                            <button
                                                                onClick={() => handleScore1Change(tempScore1 + 1)}
                                                                className="score-btn score-btn-plus"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <span className="text-navy-500 font-bold text-lg">:</span>

                                                    {/* Team 2 */}
                                                    <div className="flex-1 text-left">
                                                        <div className="text-sm font-medium text-navy-200 mb-2">
                                                            {match.team2.playerIds.map(getPlayerName).join(' & ')}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => handleScore2Change(tempScore2 - 1)}
                                                                className="score-btn score-btn-minus"
                                                            >
                                                                −
                                                            </button>
                                                            <span className="text-3xl font-black text-white w-14 text-center tabular-nums">
                                                                {tempScore2}
                                                            </span>
                                                            <button
                                                                onClick={() => handleScore2Change(tempScore2 + 1)}
                                                                className="score-btn score-btn-plus"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 justify-center mt-3">
                                                    <button onClick={saveScore} className="btn-primary py-2 px-6 text-sm">
                                                        ✓ {t.saveScore}
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingMatch(null)}
                                                        className="btn-ghost py-2 px-4 text-sm"
                                                    >
                                                        {t.cancel}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Match Display Mode */
                                            <button
                                                onClick={() => startEditing(match)}
                                                className="w-full text-left"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="flex-1 text-right">
                                                        <span className="font-medium text-white">
                                                            {match.team1.playerIds.map(getPlayerName).join(' & ')}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={`text-2xl font-black tabular-nums ${match.status === 'completed'
                                                                    ? match.score1! > match.score2!
                                                                        ? 'text-success'
                                                                        : 'text-white'
                                                                    : 'text-navy-500'
                                                                }`}
                                                        >
                                                            {match.score1 ?? '-'}
                                                        </span>
                                                        <span className="text-navy-500">:</span>
                                                        <span
                                                            className={`text-2xl font-black tabular-nums ${match.status === 'completed'
                                                                    ? match.score2! > match.score1!
                                                                        ? 'text-success'
                                                                        : 'text-white'
                                                                    : 'text-navy-500'
                                                                }`}
                                                        >
                                                            {match.score2 ?? '-'}
                                                        </span>
                                                    </div>

                                                    <div className="flex-1 text-left">
                                                        <span className="font-medium text-white">
                                                            {match.team2.playerIds.map(getPlayerName).join(' & ')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Sitting Out */}
                            {currentRound?.sitting.length > 0 && (
                                <div className="mt-4 p-3 rounded-xl bg-navy-800/50 border border-navy-700/30">
                                    <span className="text-xs font-medium text-navy-400 uppercase">
                                        {t.sittingOut}:
                                    </span>
                                    <span className="text-sm text-navy-300 ml-2">
                                        {currentRound.sitting.map(getPlayerName).join(', ')}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 items-center mt-8">
                            {isCurrentRoundComplete && hasMoreRounds && (
                                <button onClick={handleNextRound} className="btn-primary text-lg w-full max-w-sm">
                                    ↪ {t.nextRound}
                                </button>
                            )}
                            {!isCurrentRoundComplete && (
                                <p className="text-sm text-navy-400">{t.enterAllScores}</p>
                            )}
                            {isCurrentRoundComplete && (
                                <button onClick={handleFinish} className="btn-secondary w-full max-w-sm">
                                    🏁 {t.finishTournament}
                                </button>
                            )}
                        </div>

                        {/* Previous Rounds */}
                        {tournament.currentRound > 1 && (
                            <div className="mt-10">
                                <h3 className="text-sm font-bold text-navy-400 uppercase tracking-wider mb-3">
                                    Previous Rounds
                                </h3>
                                {tournament.rounds
                                    .slice(0, tournament.currentRound - 1)
                                    .reverse()
                                    .map((round) => (
                                        <div key={round.id} className="mb-4">
                                            <h4 className="text-xs font-bold text-navy-500 mb-2">
                                                {t.round} {round.number}
                                            </h4>
                                            <div className="space-y-2">
                                                {round.matches.map((match) => (
                                                    <div
                                                        key={match.id}
                                                        className="rounded-xl bg-navy-900/50 border border-navy-800/50 p-3"
                                                    >
                                                        <div className="flex items-center gap-3 text-sm">
                                                            <span className="text-xs text-navy-500">{t.court} {match.court}</span>
                                                            <div className="flex-1 text-right text-navy-300">
                                                                {match.team1.playerIds.map(getPlayerName).join(' & ')}
                                                            </div>
                                                            <span className="font-bold text-white tabular-nums">
                                                                {match.score1} : {match.score2}
                                                            </span>
                                                            <div className="flex-1 text-left text-navy-300">
                                                                {match.team2.playerIds.map(getPlayerName).join(' & ')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── Leaderboard Tab ── */}
                {activeTab === 'leaderboard' && (
                    <div className="animate-fade-in">
                        <div className="glass-card-static overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-navy-700/50">
                                        <th className="px-4 py-3 text-left text-xs font-bold text-navy-400 uppercase tracking-wider">
                                            {t.position}
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-navy-400 uppercase tracking-wider">
                                            {t.player}
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-bold text-navy-400 uppercase tracking-wider">
                                            {t.points}
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-bold text-navy-400 uppercase tracking-wider hidden sm:table-cell">
                                            {t.played}
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-bold text-navy-400 uppercase tracking-wider hidden sm:table-cell">
                                            {t.won}
                                        </th>
                                        <th className="px-4 py-3 text-center text-xs font-bold text-navy-400 uppercase tracking-wider">
                                            {t.diff}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {standings.map((s, idx) => (
                                        <tr
                                            key={s.playerId}
                                            className="border-b border-navy-800/30 hover:bg-navy-800/30 transition-colors cursor-pointer"
                                            onClick={() => {
                                                setSelectedPlayer(s.playerId);
                                                setActiveTab('stats');
                                            }}
                                        >
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`font-black text-lg ${idx === 0
                                                            ? 'position-1'
                                                            : idx === 1
                                                                ? 'position-2'
                                                                : idx === 2
                                                                    ? 'position-3'
                                                                    : 'text-navy-400'
                                                        }`}
                                                >
                                                    {idx + 1}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="font-medium text-white">{s.playerName}</span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="font-bold text-gold-400 text-lg">{s.totalPoints}</span>
                                            </td>
                                            <td className="px-4 py-3 text-center text-navy-300 hidden sm:table-cell">
                                                {s.matchesPlayed}
                                            </td>
                                            <td className="px-4 py-3 text-center text-navy-300 hidden sm:table-cell">
                                                {s.matchesWon}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span
                                                    className={`font-medium ${s.pointDifference > 0
                                                            ? 'text-success'
                                                            : s.pointDifference < 0
                                                                ? 'text-error'
                                                                : 'text-navy-400'
                                                        }`}
                                                >
                                                    {s.pointDifference > 0 ? '+' : ''}
                                                    {s.pointDifference}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── Stats Tab ── */}
                {activeTab === 'stats' && (
                    <div className="animate-fade-in">
                        {/* Player selector */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {standings.map((s) => (
                                <button
                                    key={s.playerId}
                                    onClick={() => setSelectedPlayer(s.playerId)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedPlayer === s.playerId
                                            ? 'bg-gold-500/20 text-gold-300 border border-gold-500/30'
                                            : 'bg-navy-800 text-navy-300 hover:bg-navy-700'
                                        }`}
                                >
                                    {s.playerName}
                                </button>
                            ))}
                        </div>

                        {selectedPlayer && (() => {
                            const ps = standings.find((s) => s.playerId === selectedPlayer);
                            if (!ps) return null;
                            const position = standings.indexOf(ps) + 1;

                            return (
                                <div className="glass-card-static p-6 animate-scale-in">
                                    <div className="text-center mb-6">
                                        <div className="w-16 h-16 mx-auto rounded-full bg-navy-700 flex items-center justify-center text-2xl font-black text-gold-400 mb-3">
                                            #{position}
                                        </div>
                                        <h3 className="text-xl font-bold text-white">{ps.playerName}</h3>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <div className="text-center p-3 rounded-xl bg-navy-800/50">
                                            <div className="text-2xl font-black text-gold-400">{ps.totalPoints}</div>
                                            <div className="text-xs text-navy-400 mt-1">{t.points}</div>
                                        </div>
                                        <div className="text-center p-3 rounded-xl bg-navy-800/50">
                                            <div className="text-2xl font-black text-white">{ps.matchesPlayed}</div>
                                            <div className="text-xs text-navy-400 mt-1">{t.played}</div>
                                        </div>
                                        <div className="text-center p-3 rounded-xl bg-navy-800/50">
                                            <div className="text-2xl font-black text-success">{ps.matchesWon}</div>
                                            <div className="text-xs text-navy-400 mt-1">{t.won}</div>
                                        </div>
                                        <div className="text-center p-3 rounded-xl bg-navy-800/50">
                                            <div
                                                className={`text-2xl font-black ${ps.pointDifference >= 0 ? 'text-success' : 'text-error'
                                                    }`}
                                            >
                                                {ps.pointDifference > 0 ? '+' : ''}
                                                {ps.pointDifference}
                                            </div>
                                            <div className="text-xs text-navy-400 mt-1">{t.diff}</div>
                                        </div>
                                    </div>

                                    {/* Partners played with */}
                                    {ps.partners.length > 0 && (
                                        <div className="mt-6 pt-4 border-t border-navy-700/50">
                                            <h4 className="text-xs font-medium text-navy-400 uppercase mb-2">
                                                Partners
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {ps.partners.map((pid) => (
                                                    <span
                                                        key={pid}
                                                        className="px-2 py-1 rounded-md bg-navy-700 text-navy-200 text-sm"
                                                    >
                                                        {getPlayerName(pid)}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })()}

                        {!selectedPlayer && (
                            <div className="text-center text-navy-400 py-8">
                                <p>Select a player to view detailed stats</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </>
    );
}
