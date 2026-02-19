// ==========================================
// Shareable Results via URL
// ==========================================

import { Tournament } from './types';

interface ShareData {
    n: string; // name
    f: string; // format
    s: number; // scoringSystem
    p: { i: string; n: string }[]; // players (id, name)
    t: { i: string; n: string; p: string[] }[]; // teams
    r: {
        n: number;
        m: {
            c: number;
            t1: string[];
            t2: string[];
            s1: number | null;
            s2: number | null;
        }[];
    }[]; // rounds with matches
    d: string; // createdAt
}

export function generateShareableUrl(tournament: Tournament): string {
    const shareData: ShareData = {
        n: tournament.name,
        f: tournament.format,
        s: tournament.scoringSystem,
        p: tournament.players.map((p) => ({ i: p.id, n: p.name })),
        t: tournament.teams.map((t) => ({ i: t.id, n: t.name, p: t.playerIds })),
        r: tournament.rounds.map((round) => ({
            n: round.number,
            m: round.matches.map((match) => ({
                c: match.court,
                t1: match.team1.playerIds,
                t2: match.team2.playerIds,
                s1: match.score1,
                s2: match.score2,
            })),
        })),
        d: tournament.createdAt,
    };

    const jsonStr = JSON.stringify(shareData);
    const encoded = btoa(unescape(encodeURIComponent(jsonStr)));

    if (typeof window !== 'undefined') {
        return `${window.location.origin}/results?data=${encoded}`;
    }
    return `/results?data=${encoded}`;
}

export function parseShareableData(encoded: string): Tournament | null {
    try {
        const jsonStr = decodeURIComponent(escape(atob(encoded)));
        const data: ShareData = JSON.parse(jsonStr);

        const tournament: Tournament = {
            id: 'shared_' + Date.now(),
            name: data.n,
            format: data.f as Tournament['format'],
            scoringSystem: data.s as Tournament['scoringSystem'],
            players: data.p.map((p) => ({ id: p.i, name: p.n })),
            teams: data.t.map((t) => ({ id: t.i, name: t.n, playerIds: t.p })),
            courts: Math.max(...data.r.flatMap((r) => r.m.map((m) => m.c)), 1),
            rounds: data.r.map((r, ri) => ({
                id: `shared_round_${ri}`,
                number: r.n,
                matches: r.m.map((m, mi) => ({
                    id: `shared_match_${ri}_${mi}`,
                    round: ri,
                    court: m.c,
                    team1: { playerIds: m.t1 },
                    team2: { playerIds: m.t2 },
                    score1: m.s1,
                    score2: m.s2,
                    status: m.s1 !== null ? 'completed' as const : 'upcoming' as const,
                })),
                completed: r.m.every((m) => m.s1 !== null),
                sitting: [],
            })),
            currentRound: data.r.length,
            roundMode: 'fixed',
            status: 'finished',
            createdAt: data.d,
            updatedAt: new Date().toISOString(),
            totalRounds: null,
            rankingStrategy: 'points',
        };

        return tournament;
    } catch (e) {
        console.error('Failed to parse share data', e);
        return null;
    }
}
