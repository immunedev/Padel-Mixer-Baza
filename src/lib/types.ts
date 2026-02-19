// ==========================================
// Padel Tournament Mixer — Type Definitions
// ==========================================

export type TournamentFormat =
    | 'americano'
    | 'mixedAmericano'
    | 'teamAmericano'
    | 'mexicano'
    | 'teamMexicano';

export type ScoringSystem = 16 | 21 | 24 | 32;

export type Gender = 'male' | 'female';

export type MatchStatus = 'upcoming' | 'live' | 'completed';

export type TournamentStatus = 'setup' | 'active' | 'finished';

export interface Player {
    id: string;
    name: string;
    gender?: Gender;
    teamId?: string;
}

export interface Team {
    id: string;
    name: string;
    playerIds: string[];
}

export interface MatchTeam {
    playerIds: string[];
}

export interface Match {
    id: string;
    round: number;
    court: number;
    team1: MatchTeam;
    team2: MatchTeam;
    score1: number | null;
    score2: number | null;
    status: MatchStatus;
}

export interface Round {
    id: string;
    number: number;
    matches: Match[];
    completed: boolean;
    sitting: string[]; // playerIds sitting out this round
}

export type RoundMode = 'fixed' | 'unlimited';

export interface Tournament {
    id: string;
    name: string;
    format: TournamentFormat;
    scoringSystem: ScoringSystem;
    players: Player[];
    teams: Team[];
    courts: number;
    rounds: Round[];
    currentRound: number;
    roundMode: RoundMode;
    totalRounds: number | null;
    rankingStrategy: 'points' | 'wins';
    status: TournamentStatus;
    createdAt: string;
    updatedAt: string;
}

export interface PlayerStats {
    playerId: string;
    playerName: string;
    totalPoints: number;
    matchesPlayed: number;
    matchesWon: number;
    matchesLost: number;
    partners: string[];
    pointDifference: number;
}

export interface TournamentSettings {
    name: string;
    format: TournamentFormat;
    scoringSystem: ScoringSystem;
    courts: number;
    players: Player[];
    teams: Team[];
    roundMode: RoundMode;
    totalRounds: number | null;
    rankingStrategy: 'points' | 'wins';
}
