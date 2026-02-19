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
    const ids = shuffle(players.map((p) => p.id));
    const rounds: Round[] = [];

    // Track how many times each pair has played together as partners
    const partnerCount = new Map<string, number>();
    const pairKey = (a: string, b: string) => [a, b].sort().join('|');

    // Circle method: fix first player, rotate the rest
    const fixed = ids[0];
    const rotating = ids.slice(1);
    const totalRounds = n - 1; // maximum unique rotations

    for (let r = 0; r < totalRounds; r++) {
        const currentOrder = [fixed, ...rotateArray(rotating, r)];
        const roundMatches: Match[] = [];
        const usedInRound = new Set<string>();

        for (let c = 0; c < courts; c++) {
            // Pick 4 players for this court from the rotated list
            // Use positions from both ends for variety: (0,last), (1,last-1), etc.
            const idx1 = c * 2;
            const idx2 = currentOrder.length - 1 - c * 2;
            const idx3 = c * 2 + 1;
            const idx4 = currentOrder.length - 2 - c * 2;

            if (idx3 >= idx4 || idx1 >= currentOrder.length || idx2 < 0 || idx3 >= currentOrder.length || idx4 < 0) break;

            const p1 = currentOrder[idx1];
            const p2 = currentOrder[idx2];
            const p3 = currentOrder[idx3];
            const p4 = currentOrder[idx4];

            // Check all are unique and not already used
            const four = [p1, p2, p3, p4];
            if (new Set(four).size !== 4) break;
            if (four.some((id) => usedInRound.has(id))) break;

            // Choose team split that minimizes repeat partnerships
            // Option A: (p1+p3) vs (p2+p4), Option B: (p1+p2) vs (p3+p4), Option C: (p1+p4) vs (p2+p3)
            const options: [string[], string[]][] = [
                [[p1, p3], [p2, p4]],
                [[p1, p2], [p3, p4]],
                [[p1, p4], [p2, p3]],
            ];

            // Pick the option with the fewest repeated partnerships
            let bestOption = options[0];
            let bestScore = Infinity;
            for (const [t1, t2] of options) {
                const score = (partnerCount.get(pairKey(t1[0], t1[1])) || 0)
                    + (partnerCount.get(pairKey(t2[0], t2[1])) || 0);
                if (score < bestScore) {
                    bestScore = score;
                    bestOption = [t1, t2];
                }
            }

            const [team1, team2] = bestOption;

            // Track partnerships
            partnerCount.set(pairKey(team1[0], team1[1]), (partnerCount.get(pairKey(team1[0], team1[1])) || 0) + 1);
            partnerCount.set(pairKey(team2[0], team2[1]), (partnerCount.get(pairKey(team2[0], team2[1])) || 0) + 1);

            four.forEach((id) => usedInRound.add(id));

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

        if (roundMatches.length === 0) continue;

        const sitting = ids.filter((id) => !usedInRound.has(id));

        rounds.push({
            id: generateId('round'),
            number: rounds.length + 1,
            matches: roundMatches,
            completed: false,
            sitting,
        });
    }

    return rounds;
}

// ─── Final Americano Round (1&4 vs 2&3) ─────────────────────
// Creates a final round based on current standings:
// Rank 1 + Rank 4 vs Rank 2 + Rank 3 (per court group of 4)
export function generateFinalAmericanoRound(
    players: Player[],
    standings: PlayerStats[],
    courts: number
): Round {
    const roundMatches: Match[] = [];
    const usedInRound = new Set<string>();

    // Sort by standings (highest points first)
    const orderedIds = [...standings]
        .sort((a, b) => b.totalPoints - a.totalPoints || b.pointDifference - a.pointDifference)
        .map((s) => s.playerId);

    for (let c = 0; c < courts; c++) {
        const baseIdx = c * 4;
        if (baseIdx + 3 >= orderedIds.length) break;

        // 1st + 4th vs 2nd + 3rd
        const team1 = [orderedIds[baseIdx], orderedIds[baseIdx + 3]];
        const team2 = [orderedIds[baseIdx + 1], orderedIds[baseIdx + 2]];

        team1.forEach((id) => usedInRound.add(id));
        team2.forEach((id) => usedInRound.add(id));

        roundMatches.push({
            id: generateId('match'),
            round: 0, // will be set properly by caller
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
        number: 0, // will be set by caller
        matches: roundMatches,
        completed: false,
        sitting,
    };
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

// ─── Americano Dynamic Next Round (Unlimited Mode) ──────────
// Generates the next round dynamically for Americano in unlimited mode,
// analyzing past rounds to minimize repeat partnerships and sit-outs.
export function generateAmericanoNextRound(
    players: Player[],
    existingRounds: Round[],
    courts: number
): Round {
    const n = players.length;
    const ids = players.map((p) => p.id);
    const playersPerRound = courts * 4;
    const roundNumber = existingRounds.length + 1;

    // Track how many times each pair has been partners
    const partnerCount = new Map<string, number>();
    // Track how many times each pair has been opponents
    const opponentCount = new Map<string, number>();
    // Track how many times each player has sat out
    const sitOutCount = new Map<string, number>();

    const pairKey = (a: string, b: string) => [a, b].sort().join('|');

    for (const id of ids) {
        sitOutCount.set(id, 0);
    }

    for (const round of existingRounds) {
        for (const match of round.matches) {
            // Track partnerships
            for (let i = 0; i < match.team1.playerIds.length; i++) {
                for (let j = i + 1; j < match.team1.playerIds.length; j++) {
                    const key = pairKey(match.team1.playerIds[i], match.team1.playerIds[j]);
                    partnerCount.set(key, (partnerCount.get(key) || 0) + 1);
                }
            }
            for (let i = 0; i < match.team2.playerIds.length; i++) {
                for (let j = i + 1; j < match.team2.playerIds.length; j++) {
                    const key = pairKey(match.team2.playerIds[i], match.team2.playerIds[j]);
                    partnerCount.set(key, (partnerCount.get(key) || 0) + 1);
                }
            }
            // Track opponents
            for (const p1 of match.team1.playerIds) {
                for (const p2 of match.team2.playerIds) {
                    const key = pairKey(p1, p2);
                    opponentCount.set(key, (opponentCount.get(key) || 0) + 1);
                }
            }
        }
        for (const sittingId of round.sitting) {
            sitOutCount.set(sittingId, (sitOutCount.get(sittingId) || 0) + 1);
        }
    }

    // Determine who sits out: the players who have sat out the least should play
    // Sort by sit-out count descending (those who sat most should play)
    const sortedBySitOut = [...ids].sort(
        (a, b) => (sitOutCount.get(b) || 0) - (sitOutCount.get(a) || 0)
    );

    // Select players to play: pick the top `playersPerRound` (or all if enough)
    const activePlayers = sortedBySitOut.slice(0, Math.min(playersPerRound, n));
    const sitting = ids.filter((id) => !activePlayers.includes(id));

    // Shuffle active players for variety, then assign to courts
    const shuffled = shuffle(activePlayers);

    const roundMatches: Match[] = [];
    const usedInRound = new Set<string>();

    for (let c = 0; c < courts; c++) {
        const baseIdx = c * 4;
        if (baseIdx + 3 >= shuffled.length) break;

        const four = [shuffled[baseIdx], shuffled[baseIdx + 1], shuffled[baseIdx + 2], shuffled[baseIdx + 3]];

        // Choose the team split that minimizes repeat partnerships
        const options: [string[], string[]][] = [
            [[four[0], four[1]], [four[2], four[3]]],
            [[four[0], four[2]], [four[1], four[3]]],
            [[four[0], four[3]], [four[1], four[2]]],
        ];

        let bestOption = options[0];
        let bestScore = Infinity;
        for (const [t1, t2] of options) {
            const partnerPenalty =
                (partnerCount.get(pairKey(t1[0], t1[1])) || 0) +
                (partnerCount.get(pairKey(t2[0], t2[1])) || 0);
            const opponentPenalty =
                (opponentCount.get(pairKey(t1[0], t2[0])) || 0) +
                (opponentCount.get(pairKey(t1[0], t2[1])) || 0) +
                (opponentCount.get(pairKey(t1[1], t2[0])) || 0) +
                (opponentCount.get(pairKey(t1[1], t2[1])) || 0);
            const score = partnerPenalty * 3 + opponentPenalty;
            if (score < bestScore) {
                bestScore = score;
                bestOption = [t1, t2];
            }
        }

        const [team1, team2] = bestOption;
        four.forEach((id) => usedInRound.add(id));

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

    // Add any remaining active players not assigned to a court to sitting
    const finalSitting = ids.filter((id) => !usedInRound.has(id));

    return {
        id: generateId('round'),
        number: roundNumber,
        matches: roundMatches,
        completed: false,
        sitting: finalSitting,
    };
}

// ─── Helpers ────────────────────────────────────────────────

function rotateArray<T>(arr: T[], count: number): T[] {
    const n = arr.length;
    const shift = count % n;
    return [...arr.slice(shift), ...arr.slice(0, shift)];
}
