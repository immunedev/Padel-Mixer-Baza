// ==========================================
// Scoring Engine
// ==========================================

import { Match, Player, PlayerStats, Tournament, Team } from './types';

export function calculateStandings(tournament: Tournament): PlayerStats[] {
    const statsMap = new Map<string, PlayerStats>();

    // Initialize all players
    for (const player of tournament.players) {
        statsMap.set(player.id, {
            playerId: player.id,
            playerName: player.name,
            totalPoints: 0,
            matchesPlayed: 0,
            matchesWon: 0,
            matchesLost: 0,
            partners: [],
            pointDifference: 0,
        });
    }

    // Aggregate scores from all completed matches
    for (const round of tournament.rounds) {
        for (const match of round.matches) {
            if (match.status !== 'completed' || match.score1 === null || match.score2 === null) {
                continue;
            }

            const team1Ids = match.team1.playerIds;
            const team2Ids = match.team2.playerIds;
            const s1 = match.score1;
            const s2 = match.score2;

            // Update team 1 players
            for (const pid of team1Ids) {
                const stats = statsMap.get(pid)!;
                stats.totalPoints += s1;
                stats.matchesPlayed += 1;
                stats.pointDifference += s1 - s2;
                if (s1 > s2) stats.matchesWon += 1;
                else if (s1 < s2) stats.matchesLost += 1;

                // Track partners
                for (const partnerId of team1Ids) {
                    if (partnerId !== pid && !stats.partners.includes(partnerId)) {
                        stats.partners.push(partnerId);
                    }
                }
            }

            // Update team 2 players
            for (const pid of team2Ids) {
                const stats = statsMap.get(pid)!;
                stats.totalPoints += s2;
                stats.matchesPlayed += 1;
                stats.pointDifference += s2 - s1;
                if (s2 > s1) stats.matchesWon += 1;
                else if (s2 < s1) stats.matchesLost += 1;

                // Track partners
                for (const partnerId of team2Ids) {
                    if (partnerId !== pid && !stats.partners.includes(partnerId)) {
                        stats.partners.push(partnerId);
                    }
                }
            }
        }

        // Award bye points to players sitting out in completed rounds
        if (round.completed && round.sitting && round.sitting.length > 0) {
            for (const sittingPid of round.sitting) {
                const stats = statsMap.get(sittingPid);
                if (stats) {
                    stats.totalPoints += 11;
                }
            }
        }
    }

    // Sort by total points desc, then by point difference desc, then wins desc
    const standings = Array.from(statsMap.values()).sort((a, b) => {
        if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
        if (b.pointDifference !== a.pointDifference) return b.pointDifference - a.pointDifference;
        return b.matchesWon - a.matchesWon;
    });

    return standings;
}

export function calculateTeamStandings(
    tournament: Tournament
): { teamId: string; teamName: string; totalPoints: number; matchesPlayed: number; matchesWon: number; pointDifference: number }[] {
    const teamMap = new Map<
        string,
        { teamId: string; teamName: string; totalPoints: number; matchesPlayed: number; matchesWon: number; pointDifference: number }
    >();

    for (const team of tournament.teams) {
        teamMap.set(team.id, {
            teamId: team.id,
            teamName: team.name,
            totalPoints: 0,
            matchesPlayed: 0,
            matchesWon: 0,
            pointDifference: 0,
        });
    }

    for (const round of tournament.rounds) {
        for (const match of round.matches) {
            if (match.status !== 'completed' || match.score1 === null || match.score2 === null) {
                continue;
            }

            // Find which team these players belong to
            const team1 = tournament.teams.find((t) =>
                t.playerIds.every((pid) => match.team1.playerIds.includes(pid))
            );
            const team2 = tournament.teams.find((t) =>
                t.playerIds.every((pid) => match.team2.playerIds.includes(pid))
            );

            if (team1 && teamMap.has(team1.id)) {
                const s = teamMap.get(team1.id)!;
                s.totalPoints += match.score1;
                s.matchesPlayed += 1;
                s.pointDifference += match.score1 - match.score2;
                if (match.score1 > match.score2) s.matchesWon += 1;
            }

            if (team2 && teamMap.has(team2.id)) {
                const s = teamMap.get(team2.id)!;
                s.totalPoints += match.score2;
                s.matchesPlayed += 1;
                s.pointDifference += match.score2 - match.score1;
                if (match.score2 > match.score1) s.matchesWon += 1;
            }
        }
    }

    return Array.from(teamMap.values()).sort(
        (a, b) => b.totalPoints - a.totalPoints || b.pointDifference - a.pointDifference
    );
}

export function getPlayerStats(
    tournament: Tournament,
    playerId: string
): PlayerStats | null {
    const standings = calculateStandings(tournament);
    return standings.find((s) => s.playerId === playerId) || null;
}

export function isScoreValid(
    score1: number,
    score2: number,
    scoringSystem: number
): boolean {
    // Both scores must be non-negative
    if (score1 < 0 || score2 < 0) return false;
    // Total must equal scoringSystem
    if (score1 + score2 !== scoringSystem) return false;
    return true;
}

export function getMinPlayers(format: string): number {
    switch (format) {
        case 'americano':
        case 'mexicano':
            return 4;
        case 'mixedAmericano':
            return 4; // 2M + 2F
        case 'teamAmericano':
        case 'teamMexicano':
            return 4; // 2 teams of 2
        default:
            return 4;
    }
}
