// ==========================================
// i18n — Polish (default) & English
// ==========================================

export type Locale = 'pl' | 'en';

export interface Translations {
    // General
    appName: string;
    newTournament: string;
    continueTournament: string;
    deleteTournament: string;
    noTournaments: string;
    savedTournaments: string;
    backToHome: string;
    language: string;

    // Tournament formats
    formatAmericano: string;
    formatMixedAmericano: string;
    formatTeamAmericano: string;
    formatMexicano: string;
    formatTeamMexicano: string;
    formatAmericanoDesc: string;
    formatMixedAmericanoDesc: string;
    formatTeamAmericanoDesc: string;
    formatMexicanoDesc: string;
    formatTeamMexicanoDesc: string;

    // Setup
    setupTitle: string;
    stepFormat: string;
    stepPlayers: string;
    stepSettings: string;
    stepReview: string;
    selectFormat: string;
    addPlayers: string;
    playerName: string;
    addPlayer: string;
    removePlayer: string;
    tournamentName: string;
    numberOfCourts: string;
    scoringSystem: string;
    pointsPerMatch: string;
    startTournament: string;
    next: string;
    back: string;
    review: string;
    players: string;
    courts: string;
    format: string;
    gender: string;
    male: string;
    female: string;
    teamName: string;
    addTeam: string;
    assignToTeam: string;

    // Active tournament
    matches: string;
    leaderboard: string;
    stats: string;
    round: string;
    currentRound: string;
    court: string;
    vs: string;
    score: string;
    enterScore: string;
    saveScore: string;
    nextRound: string;
    finishTournament: string;
    sittingOut: string;
    allMatchesCompleted: string;
    enterAllScores: string;
    roundOf: string;

    // Leaderboard
    position: string;
    player: string;
    points: string;
    played: string;
    won: string;
    lost: string;
    diff: string;

    // Results
    results: string;
    tournamentResults: string;
    champion: string;
    podium: string;
    finalStandings: string;
    matchHistory: string;
    shareResults: string;
    linkCopied: string;
    shareDescription: string;
    pointsTotal: string;
    matchesTotal: string;

    // Misc
    confirmDelete: string;
    cancel: string;
    confirm: string;
    close: string;
    error: string;
    success: string;
    warning: string;
    minPlayersRequired: string;
    evenPlayersRequired: string;
}

const pl: Translations = {
    appName: 'Padel Mixer',
    newTournament: 'Nowy turniej',
    continueTournament: 'Kontynuuj',
    deleteTournament: 'Usuń turniej',
    noTournaments: 'Brak zapisanych turniejów. Utwórz swój pierwszy turniej!',
    savedTournaments: 'Zapisane turnieje',
    backToHome: 'Strona główna',
    language: 'Język',

    formatAmericano: 'Americano',
    formatMixedAmericano: 'Americano Mieszane',
    formatTeamAmericano: 'Americano Drużynowe',
    formatMexicano: 'Mexicano',
    formatTeamMexicano: 'Mexicano Drużynowe',
    formatAmericanoDesc: 'Klasyczny format — każdy gra z każdym w rotacji. Punkty liczone indywidualnie.',
    formatMixedAmericanoDesc: 'Pary zawsze składają się z kobiety i mężczyzny. Punkty indywidualne.',
    formatTeamAmericanoDesc: 'Stałe drużyny 2-osobowe. Punkty liczone drużynowo.',
    formatMexicanoDesc: 'Dynamiczne pary na podstawie rankingu. Im lepiej grasz, tym trudniejsi rywale.',
    formatTeamMexicanoDesc: 'Stałe drużyny — mecze na podstawie aktualnego rankingu drużyn.',

    setupTitle: 'Konfiguracja turnieju',
    stepFormat: 'Format',
    stepPlayers: 'Gracze',
    stepSettings: 'Ustawienia',
    stepReview: 'Podsumowanie',
    selectFormat: 'Wybierz format turnieju',
    addPlayers: 'Dodaj graczy',
    playerName: 'Imię gracza',
    addPlayer: 'Dodaj gracza',
    removePlayer: 'Usuń',
    tournamentName: 'Nazwa turnieju',
    numberOfCourts: 'Liczba kortów',
    scoringSystem: 'System punktowy',
    pointsPerMatch: 'punktów na mecz',
    startTournament: 'Rozpocznij turniej',
    next: 'Dalej',
    back: 'Wstecz',
    review: 'Podsumowanie',
    players: 'Gracze',
    courts: 'Korty',
    format: 'Format',
    gender: 'Płeć',
    male: 'Mężczyzna',
    female: 'Kobieta',
    teamName: 'Nazwa drużyny',
    addTeam: 'Dodaj drużynę',
    assignToTeam: 'Przypisz do drużyny',

    matches: 'Mecze',
    leaderboard: 'Tabela',
    stats: 'Statystyki',
    round: 'Runda',
    currentRound: 'Aktualna runda',
    court: 'Kort',
    vs: 'vs',
    score: 'Wynik',
    enterScore: 'Wprowadź wynik',
    saveScore: 'Zapisz wynik',
    nextRound: 'Następna runda',
    finishTournament: 'Zakończ turniej',
    sittingOut: 'Pauzują',
    allMatchesCompleted: 'Wszystkie mecze zakończone',
    enterAllScores: 'Wprowadź wyniki wszystkich meczy aby kontynuować',
    roundOf: 'z',

    position: 'Poz.',
    player: 'Gracz',
    points: 'Punkty',
    played: 'Mecze',
    won: 'Wygrane',
    lost: 'Przegrane',
    diff: '+/-',

    results: 'Wyniki',
    tournamentResults: 'Wyniki turnieju',
    champion: 'Mistrz',
    podium: 'Podium',
    finalStandings: 'Klasyfikacja końcowa',
    matchHistory: 'Historia meczy',
    shareResults: 'Udostępnij wyniki',
    linkCopied: 'Link skopiowany!',
    shareDescription: 'Udostępnij link z wynikami turnieju',
    pointsTotal: 'Punkty łącznie',
    matchesTotal: 'Mecze łącznie',

    confirmDelete: 'Czy na pewno chcesz usunąć ten turniej?',
    cancel: 'Anuluj',
    confirm: 'Potwierdź',
    close: 'Zamknij',
    error: 'Błąd',
    success: 'Sukces',
    warning: 'Uwaga',
    minPlayersRequired: 'Wymagana minimalna liczba graczy:',
    evenPlayersRequired: 'Wymagana parzysta liczba graczy',
};

const en: Translations = {
    appName: 'Padel Mixer',
    newTournament: 'New Tournament',
    continueTournament: 'Continue',
    deleteTournament: 'Delete Tournament',
    noTournaments: 'No saved tournaments. Create your first tournament!',
    savedTournaments: 'Saved Tournaments',
    backToHome: 'Home',
    language: 'Language',

    formatAmericano: 'Americano',
    formatMixedAmericano: 'Mixed Americano',
    formatTeamAmericano: 'Team Americano',
    formatMexicano: 'Mexicano',
    formatTeamMexicano: 'Team Mexicano',
    formatAmericanoDesc: 'Classic format — everyone plays with everyone in rotation. Individual scoring.',
    formatMixedAmericanoDesc: 'Pairs are always male + female. Individual scoring.',
    formatTeamAmericanoDesc: 'Fixed 2-player teams. Team scoring.',
    formatMexicanoDesc: 'Dynamic pairing based on rankings. Better you play, tougher the opponents.',
    formatTeamMexicanoDesc: 'Fixed teams — matches based on current team rankings.',

    setupTitle: 'Tournament Setup',
    stepFormat: 'Format',
    stepPlayers: 'Players',
    stepSettings: 'Settings',
    stepReview: 'Review',
    selectFormat: 'Select tournament format',
    addPlayers: 'Add Players',
    playerName: 'Player name',
    addPlayer: 'Add Player',
    removePlayer: 'Remove',
    tournamentName: 'Tournament name',
    numberOfCourts: 'Number of courts',
    scoringSystem: 'Scoring system',
    pointsPerMatch: 'points per match',
    startTournament: 'Start Tournament',
    next: 'Next',
    back: 'Back',
    review: 'Review',
    players: 'Players',
    courts: 'Courts',
    format: 'Format',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    teamName: 'Team name',
    addTeam: 'Add team',
    assignToTeam: 'Assign to team',

    matches: 'Matches',
    leaderboard: 'Leaderboard',
    stats: 'Stats',
    round: 'Round',
    currentRound: 'Current Round',
    court: 'Court',
    vs: 'vs',
    score: 'Score',
    enterScore: 'Enter score',
    saveScore: 'Save score',
    nextRound: 'Next Round',
    finishTournament: 'Finish Tournament',
    sittingOut: 'Sitting Out',
    allMatchesCompleted: 'All matches completed',
    enterAllScores: 'Enter all match scores to continue',
    roundOf: 'of',

    position: 'Pos.',
    player: 'Player',
    points: 'Points',
    played: 'Played',
    won: 'Won',
    lost: 'Lost',
    diff: '+/-',

    results: 'Results',
    tournamentResults: 'Tournament Results',
    champion: 'Champion',
    podium: 'Podium',
    finalStandings: 'Final Standings',
    matchHistory: 'Match History',
    shareResults: 'Share Results',
    linkCopied: 'Link copied!',
    shareDescription: 'Share a link with tournament results',
    pointsTotal: 'Total Points',
    matchesTotal: 'Total Matches',

    confirmDelete: 'Are you sure you want to delete this tournament?',
    cancel: 'Cancel',
    confirm: 'Confirm',
    close: 'Close',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    minPlayersRequired: 'Minimum players required:',
    evenPlayersRequired: 'Even number of players required',
};

export const translations: Record<Locale, Translations> = { pl, en };

export function getTranslations(locale: Locale): Translations {
    return translations[locale];
}
