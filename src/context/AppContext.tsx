'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { Locale, getTranslations, Translations } from '@/lib/i18n';
import { Tournament, TournamentSettings, Match, Player, Team } from '@/lib/types';
import { saveTournament, loadTournament, listTournaments, deleteTournament as deleteStoredTournament, saveLocale, loadLocale } from '@/lib/storage';
import { calculateStandings, calculateTeamStandings } from '@/lib/scoring';
import {
    generateAmericanoRounds,
    generateMixedAmericanoRounds,
    generateTeamAmericanoRounds,
    generateMexicanoRound,
    generateTeamMexicanoRound,
    generateFinalAmericanoRound,
    generateAmericanoNextRound,
} from '@/lib/scheduler';

// ─── State ──────────────────────────────────────────────────
interface AppState {
    locale: Locale;
    t: Translations;
    tournaments: Tournament[];
    currentTournament: Tournament | null;
}

type Action =
    | { type: 'SET_LOCALE'; locale: Locale }
    | { type: 'LOAD_TOURNAMENTS'; tournaments: Tournament[] }
    | { type: 'SET_CURRENT_TOURNAMENT'; tournament: Tournament | null }
    | { type: 'CREATE_TOURNAMENT'; settings: TournamentSettings }
    | { type: 'UPDATE_SCORE'; matchId: string; score1: number; score2: number }
    | { type: 'NEXT_ROUND' }
    | { type: 'GENERATE_FINAL_ROUND' }
    | { type: 'FINISH_TOURNAMENT' }
    | { type: 'DELETE_TOURNAMENT'; id: string };

function generateTournamentId(): string {
    return `t_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
}

function createTournament(settings: TournamentSettings): Tournament {
    const id = generateTournamentId();
    const now = new Date().toISOString();
    const roundMode = settings.roundMode || 'fixed';
    const rankingStrategy = settings.rankingStrategy || 'points';
    const totalRounds = settings.totalRounds || null;

    let rounds: typeof settings.rounds = [];

    // In unlimited mode for Americano-type formats, only generate the first round
    if (roundMode === 'unlimited' && ['americano', 'mixedAmericano', 'teamAmericano'].includes(settings.format)) {
        const firstRound = generateAmericanoNextRound(settings.players, [], settings.courts);
        rounds = [firstRound];
    } else {
        switch (settings.format) {
            case 'americano':
                rounds = generateAmericanoRounds(settings.players, settings.courts);
                break;
            case 'mixedAmericano':
                rounds = generateMixedAmericanoRounds(settings.players, settings.courts);
                break;
            case 'teamAmericano':
                rounds = generateTeamAmericanoRounds(settings.teams, settings.players, settings.courts);
                break;
            case 'mexicano': {
                const firstRound = generateMexicanoRound(settings.players, [], 1, settings.courts, rankingStrategy);
                rounds = [firstRound];
                break;
            }
            case 'teamMexicano': {
                const firstRound = generateTeamMexicanoRound(settings.teams, settings.players, [], 1, settings.courts);
                rounds = [firstRound];
                break;
            }
            default:
                rounds = generateAmericanoRounds(settings.players, settings.courts);
        }

        // Handle specific number of rounds for Fixed mode (only for Americano types that are pre-generated)
        if (roundMode === 'fixed' && totalRounds && ['americano', 'mixedAmericano', 'teamAmericano'].includes(settings.format)) {
            if (rounds.length > totalRounds) {
                // Slice if fewer rounds requested
                rounds = rounds.slice(0, totalRounds);
            } else if (rounds.length < totalRounds) {
                // Generate extra rounds if more requested
                while (rounds.length < totalRounds) {
                    const nextRound = generateAmericanoNextRound(settings.players, rounds, settings.courts);
                    rounds.push(nextRound);
                }
            }
        }
    }

    return {
        id,
        name: settings.name,
        format: settings.format,
        scoringSystem: settings.scoringSystem,
        players: settings.players,
        teams: settings.teams || [],
        courts: settings.courts,
        rounds,
        currentRound: 1,
        roundMode,
        totalRounds,
        rankingStrategy,
        status: 'active',
        createdAt: now,
        updatedAt: now,
    };
}

function reducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'SET_LOCALE': {
            saveLocale(action.locale);
            return { ...state, locale: action.locale, t: getTranslations(action.locale) };
        }

        case 'LOAD_TOURNAMENTS': {
            return { ...state, tournaments: action.tournaments };
        }

        case 'SET_CURRENT_TOURNAMENT': {
            return { ...state, currentTournament: action.tournament };
        }

        case 'CREATE_TOURNAMENT': {
            const tournament = createTournament(action.settings);
            saveTournament(tournament);
            const tournaments = [...state.tournaments, tournament];
            return { ...state, tournaments, currentTournament: tournament };
        }

        case 'UPDATE_SCORE': {
            if (!state.currentTournament) return state;
            const t = { ...state.currentTournament };
            t.rounds = t.rounds.map((round) => ({
                ...round,
                matches: round.matches.map((match) => {
                    if (match.id === action.matchId) {
                        return {
                            ...match,
                            score1: action.score1,
                            score2: action.score2,
                            status: 'completed' as const,
                        };
                    }
                    return match;
                }),
            }));

            // Check if current round is complete
            const currentRound = t.rounds[t.currentRound - 1];
            if (currentRound) {
                currentRound.completed = currentRound.matches.every(
                    (m) => m.status === 'completed'
                );
            }

            t.updatedAt = new Date().toISOString();
            saveTournament(t);
            const tournaments = state.tournaments.map((tour) =>
                tour.id === t.id ? t : tour
            );
            return { ...state, currentTournament: t, tournaments };
        }

        case 'NEXT_ROUND': {
            if (!state.currentTournament) return state;
            const t = { ...state.currentTournament };
            const nextRoundNumber = t.currentRound + 1;

            // For Mexicano formats, generate next round dynamically
            if (t.format === 'mexicano') {
                const standings = calculateStandings(t);
                const newRound = generateMexicanoRound(t.players, standings, nextRoundNumber, t.courts, t.rankingStrategy);
                t.rounds = [...t.rounds, newRound];
            } else if (t.format === 'teamMexicano') {
                const teamStandings = calculateTeamStandings(t);
                const newRound = generateTeamMexicanoRound(
                    t.teams,
                    t.players,
                    teamStandings,
                    nextRoundNumber,
                    t.courts
                );
                t.rounds = [...t.rounds, newRound];
            } else if (t.roundMode === 'unlimited') {
                // Unlimited mode for Americano-type formats: generate next round dynamically
                const newRound = generateAmericanoNextRound(t.players, t.rounds, t.courts);
                t.rounds = [...t.rounds, newRound];
            }

            // For pre-generated rounds (fixed Americano), just advance
            if (nextRoundNumber > t.rounds.length) {
                // No more rounds - tournament should be finished
                return state;
            }

            t.currentRound = nextRoundNumber;
            t.updatedAt = new Date().toISOString();
            saveTournament(t);
            const tournaments = state.tournaments.map((tour) =>
                tour.id === t.id ? t : tour
            );
            return { ...state, currentTournament: t, tournaments };
        }

        case 'GENERATE_FINAL_ROUND': {
            if (!state.currentTournament) return state;
            const t = { ...state.currentTournament };
            const standings = calculateStandings(t);
            const nextRoundNumber = t.currentRound + 1;
            const finalRound = generateFinalAmericanoRound(t.players, standings, t.courts, t.rankingStrategy);
            finalRound.number = nextRoundNumber;
            finalRound.matches = finalRound.matches.map((m) => ({ ...m, round: nextRoundNumber - 1 }));
            t.rounds = [...t.rounds, finalRound];
            t.currentRound = nextRoundNumber;
            t.updatedAt = new Date().toISOString();
            saveTournament(t);
            const tournaments = state.tournaments.map((tour) =>
                tour.id === t.id ? t : tour
            );
            return { ...state, currentTournament: t, tournaments };
        }

        case 'FINISH_TOURNAMENT': {
            if (!state.currentTournament) return state;
            const t = { ...state.currentTournament, status: 'finished' as const, updatedAt: new Date().toISOString() };
            saveTournament(t);
            const tournaments = state.tournaments.map((tour) =>
                tour.id === t.id ? t : tour
            );
            return { ...state, currentTournament: t, tournaments };
        }

        case 'DELETE_TOURNAMENT': {
            deleteStoredTournament(action.id);
            const tournaments = state.tournaments.filter((t) => t.id !== action.id);
            const currentTournament =
                state.currentTournament?.id === action.id ? null : state.currentTournament;
            return { ...state, tournaments, currentTournament };
        }

        default:
            return state;
    }
}

// ─── Context ────────────────────────────────────────────────
interface AppContextType extends AppState {
    dispatch: React.Dispatch<Action>;
    setLocale: (locale: Locale) => void;
    loadTournamentById: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
    const initialLocale: Locale = 'pl';
    const [state, dispatch] = useReducer(reducer, {
        locale: initialLocale,
        t: getTranslations(initialLocale),
        tournaments: [],
        currentTournament: null,
    });

    useEffect(() => {
        const savedLocale = loadLocale() as Locale;
        if (savedLocale && savedLocale !== state.locale) {
            dispatch({ type: 'SET_LOCALE', locale: savedLocale });
        }
        const tournaments = listTournaments();
        dispatch({ type: 'LOAD_TOURNAMENTS', tournaments });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setLocale = useCallback((locale: Locale) => {
        dispatch({ type: 'SET_LOCALE', locale });
    }, []);

    const loadTournamentById = useCallback((id: string) => {
        const tournament = loadTournament(id);
        dispatch({ type: 'SET_CURRENT_TOURNAMENT', tournament });
    }, []);

    return (
        <AppContext.Provider value={{ ...state, dispatch, setLocale, loadTournamentById }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp(): AppContextType {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
}
