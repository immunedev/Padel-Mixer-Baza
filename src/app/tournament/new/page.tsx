'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Header from '@/components/Header';
import { TournamentFormat, ScoringSystem, Player, Team, Gender, RoundMode } from '@/lib/types';

type Step = 'format' | 'players' | 'settings' | 'review';
const STEPS: Step[] = ['format', 'players', 'settings', 'review'];

const FORMAT_OPTIONS: { value: TournamentFormat; icon: string }[] = [
    { value: 'americano', icon: '🎾' },
    { value: 'mixedAmericano', icon: '👫' },
    { value: 'teamAmericano', icon: '👥' },
    { value: 'mexicano', icon: '🌮' },
    { value: 'teamMexicano', icon: '🏆' },
];

const SCORING_OPTIONS: ScoringSystem[] = [16, 21, 24, 32];

export default function NewTournamentPage() {
    const { t, dispatch } = useApp();
    const router = useRouter();

    const [step, setStep] = useState<Step>('format');
    const [format, setFormat] = useState<TournamentFormat>('americano');
    const [players, setPlayers] = useState<Player[]>([]);
    const [newPlayerName, setNewPlayerName] = useState('');
    const [newPlayerGender, setNewPlayerGender] = useState<Gender>('male');
    const [teams, setTeams] = useState<Team[]>([]);
    const [newTeamName, setNewTeamName] = useState('');
    const [tournamentName, setTournamentName] = useState('');
    const [courts, setCourts] = useState(2);
    const [scoringSystem, setScoringSystem] = useState<ScoringSystem>(21);
    const [roundMode, setRoundMode] = useState<RoundMode>('unlimited');

    // Pre-fill from repeat tournament settings
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('repeat') === '1') {
            try {
                const raw = localStorage.getItem('padel_repeat_settings');
                if (raw) {
                    const s = JSON.parse(raw);
                    if (s.format) setFormat(s.format);
                    if (s.players) setPlayers(s.players);
                    if (s.teams) setTeams(s.teams);
                    if (s.name) setTournamentName(s.name);
                    if (s.courts) setCourts(s.courts);
                    if (s.scoringSystem) setScoringSystem(s.scoringSystem);
                    if (s.roundMode) setRoundMode(s.roundMode);
                    setStep('settings');
                    localStorage.removeItem('padel_repeat_settings');
                }
            } catch (e) {
                console.error('Failed to parse repeat settings', e);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isTeamFormat = format === 'teamAmericano' || format === 'teamMexicano';
    const isMixedFormat = format === 'mixedAmericano';

    const getFormatLabel = (f: TournamentFormat) => {
        const map: Record<TournamentFormat, string> = {
            americano: t.formatAmericano,
            mixedAmericano: t.formatMixedAmericano,
            teamAmericano: t.formatTeamAmericano,
            mexicano: t.formatMexicano,
            teamMexicano: t.formatTeamMexicano,
        };
        return map[f];
    };

    const getFormatDesc = (f: TournamentFormat) => {
        const map: Record<TournamentFormat, string> = {
            americano: t.formatAmericanoDesc,
            mixedAmericano: t.formatMixedAmericanoDesc,
            teamAmericano: t.formatTeamAmericanoDesc,
            mexicano: t.formatMexicanoDesc,
            teamMexicano: t.formatTeamMexicanoDesc,
        };
        return map[f];
    };

    const stepLabel = (s: Step) => {
        const map: Record<Step, string> = {
            format: t.stepFormat,
            players: t.stepPlayers,
            settings: t.stepSettings,
            review: t.stepReview,
        };
        return map[s];
    };

    const addPlayer = () => {
        if (!newPlayerName.trim()) return;
        const player: Player = {
            id: `p_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            name: newPlayerName.trim(),
            gender: isMixedFormat ? newPlayerGender : undefined,
        };
        setPlayers([...players, player]);
        setNewPlayerName('');
    };

    const removePlayer = (id: string) => {
        setPlayers(players.filter((p) => p.id !== id));
        // Also remove from teams
        setTeams(teams.map((t) => ({
            ...t,
            playerIds: t.playerIds.filter((pid) => pid !== id),
        })));
    };

    const addTeam = () => {
        if (!newTeamName.trim()) return;
        const team: Team = {
            id: `team_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            name: newTeamName.trim(),
            playerIds: [],
        };
        setTeams([...teams, team]);
        setNewTeamName('');
    };

    const togglePlayerInTeam = (playerId: string, teamId: string) => {
        setTeams(teams.map((team) => {
            if (team.id === teamId) {
                if (team.playerIds.includes(playerId)) {
                    return { ...team, playerIds: team.playerIds.filter((id) => id !== playerId) };
                }
                if (team.playerIds.length < 2) {
                    return { ...team, playerIds: [...team.playerIds, playerId] };
                }
            } else {
                // Remove from other teams
                return { ...team, playerIds: team.playerIds.filter((id) => id !== playerId) };
            }
            return team;
        }));
    };

    const canProceed = () => {
        switch (step) {
            case 'format':
                return true;
            case 'players':
                if (isTeamFormat) {
                    return teams.length >= 2 && teams.every((t) => t.playerIds.length === 2);
                }
                if (isMixedFormat) {
                    const males = players.filter((p) => p.gender === 'male').length;
                    const females = players.filter((p) => p.gender === 'female').length;
                    return males >= 2 && females >= 2;
                }
                return players.length >= 4;
            case 'settings':
                return tournamentName.trim().length > 0;
            case 'review':
                return true;
            default:
                return false;
        }
    };

    const handleNext = () => {
        const idx = STEPS.indexOf(step);
        if (idx < STEPS.length - 1) {
            setStep(STEPS[idx + 1]);
        }
    };

    const handleBack = () => {
        const idx = STEPS.indexOf(step);
        if (idx > 0) {
            setStep(STEPS[idx - 1]);
        } else {
            router.push('/');
        }
    };

    const handleStart = () => {
        dispatch({
            type: 'CREATE_TOURNAMENT',
            settings: {
                name: tournamentName,
                format,
                scoringSystem,
                courts,
                players,
                teams: isTeamFormat ? teams : [],
                roundMode,
            },
        });
        // Navigate to the active tournament (the latest one)
        // We get it from state after dispatch
        setTimeout(() => {
            const stored = JSON.parse(localStorage.getItem('padel_tournaments') || '[]');
            const latest = stored[stored.length - 1];
            if (latest) {
                router.push(`/tournament/${latest.id}`);
            }
        }, 100);
    };

    const handleKeyDown = (e: React.KeyboardEvent, addFn: () => void) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addFn();
        }
    };

    return (
        <>
            <Header />
            <main className="max-w-3xl mx-auto px-4 py-8">
                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-2 mb-8 animate-fade-in">
                    {STEPS.map((s, i) => (
                        <div key={s} className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    const currentIdx = STEPS.indexOf(step);
                                    if (i <= currentIdx) setStep(s);
                                }}
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step === s
                                    ? 'bg-gold-500 text-navy-950 scale-110'
                                    : STEPS.indexOf(s) < STEPS.indexOf(step)
                                        ? 'bg-navy-500 text-white'
                                        : 'bg-navy-800 text-navy-400'
                                    }`}
                            >
                                {i + 1}
                            </button>
                            <span
                                className={`text-sm font-medium hidden sm:inline ${step === s ? 'text-gold-400' : 'text-navy-400'
                                    }`}
                            >
                                {stepLabel(s)}
                            </span>
                            {i < STEPS.length - 1 && (
                                <div
                                    className={`w-8 h-0.5 ${STEPS.indexOf(s) < STEPS.indexOf(step)
                                        ? 'bg-navy-500'
                                        : 'bg-navy-800'
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className="animate-fade-in">
                    {/* ── Format Selection ── */}
                    {step === 'format' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6 text-center">{t.selectFormat}</h2>
                            <div className="grid gap-3">
                                {FORMAT_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setFormat(opt.value)}
                                        className={`glass-card p-5 text-left transition-all ${format === opt.value
                                            ? 'border-gold-500/50 bg-gold-500/10 shadow-lg shadow-gold-500/10'
                                            : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <span className="text-3xl">{opt.icon}</span>
                                            <div>
                                                <h3 className="font-bold text-lg text-white mb-1">
                                                    {getFormatLabel(opt.value)}
                                                </h3>
                                                <p className="text-sm text-navy-300 leading-relaxed">
                                                    {getFormatDesc(opt.value)}
                                                </p>
                                            </div>
                                            {format === opt.value && (
                                                <div className="ml-auto text-gold-400 text-xl">✓</div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Players ── */}
                    {step === 'players' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6 text-center">{t.addPlayers}</h2>

                            {/* Add Player Form */}
                            <div className="glass-card-static p-4 mb-6">
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={newPlayerName}
                                        onChange={(e) => setNewPlayerName(e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, addPlayer)}
                                        placeholder={t.playerName}
                                        className="input flex-1"
                                        autoFocus
                                    />
                                    {isMixedFormat && (
                                        <select
                                            value={newPlayerGender}
                                            onChange={(e) => setNewPlayerGender(e.target.value as Gender)}
                                            className="input w-36"
                                        >
                                            <option value="male">♂ {t.male}</option>
                                            <option value="female">♀ {t.female}</option>
                                        </select>
                                    )}
                                    <button onClick={addPlayer} className="btn-primary whitespace-nowrap">
                                        + {t.addPlayer}
                                    </button>
                                </div>
                            </div>

                            {/* Player List */}
                            <div className="space-y-2 mb-6">
                                {players.map((player, idx) => (
                                    <div
                                        key={player.id}
                                        className="glass-card-static p-3 flex items-center justify-between animate-fade-in"
                                        style={{ animationDelay: `${idx * 0.03}s` }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-navy-600 flex items-center justify-center text-sm font-bold text-navy-200">
                                                {idx + 1}
                                            </div>
                                            <span className="font-medium text-white">{player.name}</span>
                                            {isMixedFormat && (
                                                <span className="text-sm text-navy-300">
                                                    {player.gender === 'male' ? '♂' : '♀'}
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => removePlayer(player.id)}
                                            className="btn-ghost text-red-400 hover:text-red-300 py-1 px-3 text-sm"
                                        >
                                            {t.removePlayer}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Team Assignment (for team formats) */}
                            {isTeamFormat && players.length >= 2 && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-bold mb-4 text-navy-200">Drużyny / Teams</h3>

                                    <div className="glass-card-static p-4 mb-4">
                                        <div className="flex gap-3">
                                            <input
                                                type="text"
                                                value={newTeamName}
                                                onChange={(e) => setNewTeamName(e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(e, addTeam)}
                                                placeholder={t.teamName}
                                                className="input flex-1"
                                            />
                                            <button onClick={addTeam} className="btn-secondary whitespace-nowrap">
                                                + {t.addTeam}
                                            </button>
                                        </div>
                                    </div>

                                    {teams.map((team) => (
                                        <div key={team.id} className="glass-card-static p-4 mb-3">
                                            <h4 className="font-bold text-gold-400 mb-3">{team.name}</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {players.map((player) => {
                                                    const isInTeam = team.playerIds.includes(player.id);
                                                    const isInOtherTeam = teams.some(
                                                        (t) => t.id !== team.id && t.playerIds.includes(player.id)
                                                    );
                                                    return (
                                                        <button
                                                            key={player.id}
                                                            onClick={() => togglePlayerInTeam(player.id, team.id)}
                                                            disabled={isInOtherTeam && !isInTeam}
                                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${isInTeam
                                                                ? 'bg-gold-500/20 text-gold-300 border border-gold-500/30'
                                                                : isInOtherTeam
                                                                    ? 'bg-navy-800 text-navy-500 cursor-not-allowed'
                                                                    : 'bg-navy-700 text-navy-200 hover:bg-navy-600'
                                                                }`}
                                                        >
                                                            {player.name}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            <div className="mt-2 text-xs text-navy-400">
                                                {team.playerIds.length}/2 {t.players.toLowerCase()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Validation hints */}
                            <div className="text-center text-sm text-navy-400">
                                {isMixedFormat ? (
                                    <p>
                                        ♂ {players.filter((p) => p.gender === 'male').length} | ♀{' '}
                                        {players.filter((p) => p.gender === 'female').length} ({t.minPlayersRequired} 2+2)
                                    </p>
                                ) : (
                                    <p>
                                        {players.length} {t.players.toLowerCase()} ({t.minPlayersRequired} 4)
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── Settings ── */}
                    {step === 'settings' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6 text-center">{t.stepSettings}</h2>

                            <div className="space-y-6">
                                <div className="glass-card-static p-5">
                                    <label className="block text-sm font-medium text-navy-300 mb-2">
                                        {t.tournamentName}
                                    </label>
                                    <input
                                        type="text"
                                        value={tournamentName}
                                        onChange={(e) => setTournamentName(e.target.value)}
                                        placeholder={t.tournamentName}
                                        className="input"
                                        autoFocus
                                    />
                                </div>

                                <div className="glass-card-static p-5">
                                    <label className="block text-sm font-medium text-navy-300 mb-3">
                                        {t.numberOfCourts}
                                    </label>
                                    <div className="flex gap-3">
                                        {[1, 2, 3, 4].map((n) => (
                                            <button
                                                key={n}
                                                onClick={() => setCourts(n)}
                                                className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all ${courts === n
                                                    ? 'bg-gold-500 text-navy-950 shadow-lg shadow-gold-500/20'
                                                    : 'bg-navy-800 text-navy-300 hover:bg-navy-700'
                                                    }`}
                                            >
                                                {n}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="glass-card-static p-5">
                                    <label className="block text-sm font-medium text-navy-300 mb-3">
                                        {t.scoringSystem}
                                    </label>
                                    <div className="flex gap-3">
                                        {SCORING_OPTIONS.map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setScoringSystem(s)}
                                                className={`flex-1 py-3 rounded-xl font-bold transition-all ${scoringSystem === s
                                                    ? 'bg-gold-500 text-navy-950 shadow-lg shadow-gold-500/20'
                                                    : 'bg-navy-800 text-navy-300 hover:bg-navy-700'
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-navy-400 mt-2 text-center">
                                        {t.pointsPerMatch}
                                    </p>
                                </div>

                                <div className="glass-card-static p-5">
                                    <label className="block text-sm font-medium text-navy-300 mb-3">
                                        {t.roundModeLabel}
                                    </label>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setRoundMode('fixed')}
                                            className={`flex-1 py-3 rounded-xl font-bold transition-all ${roundMode === 'fixed'
                                                ? 'bg-gold-500 text-navy-950 shadow-lg shadow-gold-500/20'
                                                : 'bg-navy-800 text-navy-300 hover:bg-navy-700'
                                                }`}
                                        >
                                            {t.roundModeFixed}
                                        </button>
                                        <button
                                            onClick={() => setRoundMode('unlimited')}
                                            className={`flex-1 py-3 rounded-xl font-bold transition-all ${roundMode === 'unlimited'
                                                ? 'bg-gold-500 text-navy-950 shadow-lg shadow-gold-500/20'
                                                : 'bg-navy-800 text-navy-300 hover:bg-navy-700'
                                                }`}
                                        >
                                            ∞ {t.roundModeUnlimited}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Review ── */}
                    {step === 'review' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6 text-center">{t.stepReview}</h2>

                            <div className="glass-card-static p-6 space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-navy-700/50">
                                    <span className="text-navy-300">{t.tournamentName}</span>
                                    <span className="font-bold text-white">{tournamentName}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-navy-700/50">
                                    <span className="text-navy-300">{t.format}</span>
                                    <span className="font-bold text-white">{getFormatLabel(format)}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-navy-700/50">
                                    <span className="text-navy-300">{t.players}</span>
                                    <span className="font-bold text-white">{players.length}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-navy-700/50">
                                    <span className="text-navy-300">{t.courts}</span>
                                    <span className="font-bold text-white">{courts}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-navy-300">{t.scoringSystem}</span>
                                    <span className="font-bold text-white">{scoringSystem} pkt</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-t border-navy-700/50">
                                    <span className="text-navy-300">{t.roundModeLabel}</span>
                                    <span className="font-bold text-white">
                                        {roundMode === 'unlimited' ? `∞ ${t.roundModeUnlimited}` : t.roundModeFixed}
                                    </span>
                                </div>

                                {/* Player names */}
                                <div className="pt-4 border-t border-navy-700/50">
                                    <h4 className="text-sm font-medium text-navy-300 mb-3">{t.players}:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {players.map((p) => (
                                            <span
                                                key={p.id}
                                                className="px-3 py-1 rounded-full bg-navy-700 text-navy-200 text-sm"
                                            >
                                                {p.name}
                                                {isMixedFormat && (
                                                    <span className="ml-1 text-navy-400">
                                                        {p.gender === 'male' ? '♂' : '♀'}
                                                    </span>
                                                )}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Teams */}
                                {isTeamFormat && teams.length > 0 && (
                                    <div className="pt-4 border-t border-navy-700/50">
                                        <h4 className="text-sm font-medium text-navy-300 mb-3">Drużyny:</h4>
                                        <div className="space-y-2">
                                            {teams.map((team) => (
                                                <div key={team.id} className="flex items-center gap-2">
                                                    <span className="font-bold text-gold-400">{team.name}:</span>
                                                    <span className="text-navy-200">
                                                        {team.playerIds
                                                            .map((id) => players.find((p) => p.id === id)?.name)
                                                            .join(' & ')}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                    <button onClick={handleBack} className="btn-secondary">
                        ← {t.back}
                    </button>

                    {step === 'review' ? (
                        <button onClick={handleStart} className="btn-primary text-lg">
                            🎾 {t.startTournament}
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            disabled={!canProceed()}
                            className="btn-primary"
                        >
                            {t.next} →
                        </button>
                    )}
                </div>
            </main>
        </>
    );
}
