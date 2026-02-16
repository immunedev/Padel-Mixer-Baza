// ==========================================
// Match Scheduling & Pairing Algorithms
// ==========================================

import { Match, MatchTeam, Player, PlayerStats, Round, Team } from './types';

let matchIdCounter = 0;
let roundIdCounter = 0;

function generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
}

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ─── Americano (Classic) ────────────────────────────────────
// Round-robin rotation — every player pairs with and faces every other player.
// Uses "circle method": fix one player, rotate the rest.
export function generateAmericanoRounds(
    players: Player[],
    courts: number
): Round[] {
    const n = players.length;
    const playersPerRound = courts * 4;
    const ids = players.map((p) => p.id);

    // We generate all unique pairings and try to schedule them fairly
    const allPairings = generateAllPairings(ids);
    const rounds: Round[] = [];
    const usedPairings = new Set<string>();

    // Generate enough rounds so everyone plays a good amount
    const totalRounds = Math.min(n - 1, Math.ceil(allPairings.length / courts));

    for (let r = 0; r < totalRounds; r++) {
        const roundMatches: Match[] = [];
        const usedInRound = new Set<string>();

        for (let c = 0; c < courts; c++) {
            // Find a valid pairing of 4 players not yet used in this round
            const match = findBestMatch(ids, usedInRound, usedPairings, courts);
            if (!match) break;

            match.forEach((pid) => usedInRound.add(pid));
            const pairingKey = `${match[0]}-${match[1]}`;
            usedPairings.add(pairingKey);

            roundMatches.push({
                id: generateId('match'),
                round: r,
                court: c + 1,
                team1: { playerIds: [match[0], match[1]] },
                team2: { playerIds: [match[2], match[3]] },
                score1: null,
                score2: null,
                status: r === 0 ? 'upcoming' : 'upcoming',
            });
        }

        const sitting = ids.filter((id) => !usedInRound.has(id));

        rounds.push({
            id: generateId('round'),
            number: r + 1,
            matches: roundMatches,
            completed: false,
            sitting,
        });
    }

    return rounds;
}

function generateAllPairings(playerIds: string[]): [string, string][] {
    const pairs: [string, string][] = [];
    for (let i = 0; i < playerIds.length; i++) {
        for (let j = i + 1; j < playerIds.length; j++) {
            pairs.push([playerIds[i], playerIds[j]]);
        }
    }
    return shuffle(pairs);
}

function findBestMatch(
    allPlayers: string[],
    usedInRound: Set<string>,
    usedPairings: Set<string>,
    courts: number
): string[] | null {
    const available = allPlayers.filter((p) => !usedInRound.has(p));
    if (available.length < 4) return null;

    // Simple approach: take first 4 available & create 2 teams
    const selected = available.slice(0, 4);
    return selected;
}

// ─── Mixed Americano ────────────────────────────────────────
// Every team must have 1 male + 1 female
export function generateMixedAmericanoRounds(
    players: Player[],
    courts: number
): Round[] {
    const males = players.filter((p) => p.gender === 'male');
    const females = players.filter((p) => p.gender === 'female');
    const n = Math.min(males.length, females.length);
    const totalRounds = n - 1;
    const rounds: Round[] = [];

    const shuffledMales = shuffle(males.map((m) => m.id));
    const shuffledFemales = shuffle(females.map((f) => f.id));

    for (let r = 0; r < totalRounds; r++) {
        const roundMatches: Match[] = [];
        const usedInRound = new Set<string>();

        // Rotate females relative to males
        const rotatedFemales = [
            ...shuffledFemales.slice(r % n),
            ...shuffledFemales.slice(0, r % n),
        ];

        for (let c = 0; c < courts; c++) {
            const idx1 = c * 2;
            const idx2 = c * 2 + 1;

            if (idx2 >= n) break;

            const team1 = [shuffledMales[idx1], rotatedFemales[idx1]];
            const team2 = [shuffledMales[idx2], rotatedFemales[idx2]];

            team1.forEach((id) => usedInRound.add(id));
            team2.forEach((id) => usedInRound.add(id));

            roundMatches.push({
                id: generateId('match'),
                round: r,
                court: c + 1,
                team1: { playerIds: team1 },
                team2: { playerIds: team2 },
                score1: null,
                score2: null,
                status: 'upcoming',
            });
        }

        const allIds = players.map((p) => p.id);
        const sitting = allIds.filter((id) => !usedInRound.has(id));

        rounds.push({
            id: generateId('round'),
            number: r + 1,
            matches: roundMatches,
            completed: false,
            sitting,
        });
    }

    return rounds;
}

// ─── Team Americano ─────────────────────────────────────────
// Fixed teams, round-robin opponents
export function generateTeamAmericanoRounds(
    teams: Team[],
    players: Player[],
    courts: number
): Round[] {
    const n = teams.length;
    const rounds: Round[] = [];
    const totalRounds = n - 1;

    // Circle method for round-robin
    const teamIds = teams.map((t) => t.id);
    const fixed = teamIds[0];
    const rotating = teamIds.slice(1);

    for (let r = 0; r < totalRounds; r++) {
        const roundMatches: Match[] = [];
        const currentOrder = [fixed, ...rotateArray(rotating, r)];
        const usedInRound = new Set<string>();

        for (let c = 0; c < courts; c++) {
            const idx1 = c;
            const idx2 = currentOrder.length - 1 - c;
            if (idx1 >= idx2) break;

            const team1 = teams.find((t) => t.id === currentOrder[idx1])!;
            const team2 = teams.find((t) => t.id === currentOrder[idx2])!;

            team1.playerIds.forEach((id) => usedInRound.add(id));
            team2.playerIds.forEach((id) => usedInRound.add(id));

            roundMatches.push({
                id: generateId('match'),
                round: r,
                court: c + 1,
                team1: { playerIds: team1.playerIds },
                team2: { playerIds: team2.playerIds },
                score1: null,
                score2: null,
                status: 'upcoming',
            });
        }

        const allIds = players.map((p) => p.id);
        const sitting = allIds.filter((id) => !usedInRound.has(id));

        rounds.push({
            id: generateId('round'),
            number: r + 1,
            matches: roundMatches,
            completed: false,
            sitting,
        });
    }

    return rounds;
}

// ─── Mexicano ───────────────────────────────────────────────
// Dynamic pairing based on current standings.
// Round 1 is random, subsequent rounds pair by ranking:
// 1st+3rd vs 2nd+4th, 5th+7th vs 6th+8th, etc.
export function generateMexicanoRound(
    players: Player[],
    standings: PlayerStats[],
    roundNumber: number,
    courts: number
): Round {
    const roundMatches: Match[] = [];
    const usedInRound = new Set<string>();

    let orderedIds: string[];

    if (roundNumber === 1) {
        // Random for first round
        orderedIds = shuffle(players.map((p) => p.id));
    } else {
        // Sort by standings (highest points first)
        orderedIds = [...standings]
            .sort((a, b) => b.totalPoints - a.totalPoints || b.pointDifference - a.pointDifference)
            .map((s) => s.playerId);
    }

    for (let c = 0; c < courts; c++) {
        const baseIdx = c * 4;
        if (baseIdx + 3 >= orderedIds.length) break;

        // 1st+3rd vs 2nd+4th pattern
        const team1 = [orderedIds[baseIdx], orderedIds[baseIdx + 2]];
        const team2 = [orderedIds[baseIdx + 1], orderedIds[baseIdx + 3]];

        team1.forEach((id) => usedInRound.add(id));
        team2.forEach((id) => usedInRound.add(id));

        roundMatches.push({
            id: generateId('match'),
            round: roundNumber - 1,
            court: c + 1,
            team1: { playerIds: team1 },
            team2: { playerIds: team2 },
            score1: null,
            score2: null,
            status: 'upcoming',
        });
    }

    const allIds = players.map((p) => p.id);
    const sitting = allIds.filter((id) => !usedInRound.has(id));

    return {
        id: generateId('round'),
        number: roundNumber,
        matches: roundMatches,
        completed: false,
        sitting,
    };
}

// ─── Team Mexicano ──────────────────────────────────────────
// Fixed teams, matches based on team standings
export function generateTeamMexicanoRound(
    teams: Team[],
    players: Player[],
    teamStandings: { teamId: string; totalPoints: number }[],
    roundNumber: number,
    courts: number
): Round {
    const roundMatches: Match[] = [];
    const usedInRound = new Set<string>();

    let orderedTeams: Team[];

    if (roundNumber === 1) {
        orderedTeams = shuffle([...teams]);
    } else {
        const sorted = [...teamStandings].sort(
            (a, b) => b.totalPoints - a.totalPoints
        );
        orderedTeams = sorted.map(
            (s) => teams.find((t) => t.id === s.teamId)!
        );
    }

    for (let c = 0; c < courts; c++) {
        const idx1 = c * 2;
        const idx2 = c * 2 + 1;
        if (idx2 >= orderedTeams.length) break;

        const team1 = orderedTeams[idx1];
        const team2 = orderedTeams[idx2];

        team1.playerIds.forEach((id) => usedInRound.add(id));
        team2.playerIds.forEach((id) => usedInRound.add(id));

        roundMatches.push({
            id: generateId('match'),
            round: roundNumber - 1,
            court: c + 1,
            team1: { playerIds: team1.playerIds },
            team2: { playerIds: team2.playerIds },
            score1: null,
            score2: null,
            status: 'upcoming',
        });
    }

    const allIds = players.map((p) => p.id);
    const sitting = allIds.filter((id) => !usedInRound.has(id));

    return {
        id: generateId('round'),
        number: roundNumber,
        matches: roundMatches,
        completed: false,
        sitting,
    };
}

// ─── Helpers ────────────────────────────────────────────────

function rotateArray<T>(arr: T[], count: number): T[] {
    const n = arr.length;
    const shift = count % n;
    return [...arr.slice(shift), ...arr.slice(0, shift)];
}
