// ==========================================
// i18n — Polish (default), English & German
// ==========================================

export type Locale = 'pl' | 'en' | 'de';

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

    // Sorting
    sortResults: string;
    sortByPoints: string;
    sortByWins: string;

    // Last match
    lastMatch: string;
    lastMatchConfirm: string;
    lastMatchWarning: string;
    previousRounds: string;

    // Repeat
    repeatTournament: string;
    repeatTournamentDesc: string;

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
    roundModeLabel: string;
    roundModeFixed: string;
    roundModeUnlimited: string;
    byePoints: string;

    // Priority
    rankingPriority: string;
    rankingPriorityDesc: string;
    priorityWins: string;
    priorityLabel: string;

    // Search & pagination
    searchTournaments: string;
    filterAll: string;
    filterActive: string;
    filterFinished: string;
    previousPage: string;
    nextPage: string;
    pageOf: string;
}

const pl: Translations = {
    appName: 'Baza Padel Tournament',
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

    sortResults: 'Sortowanie',
    sortByPoints: 'Po punktach',
    sortByWins: 'Po wygranych',
    lastMatch: 'Ostatni mecz',
    lastMatchConfirm: 'Czy na pewno chcesz zagrać ostatni mecz?',
    lastMatchWarning: 'Po wprowadzeniu wyników turniej zostanie zakończony.',
    previousRounds: 'Poprzednie rundy',
    repeatTournament: 'Powtórz turniej',
    repeatTournamentDesc: 'Stwórz nowy turniej z tymi samymi ustawieniami',

    confirmDelete: 'Czy na pewno chcesz usunąć ten turniej?',
    cancel: 'Anuluj',
    confirm: 'Potwierdź',
    close: 'Zamknij',
    error: 'Błąd',
    success: 'Sukces',
    warning: 'Uwaga',
    minPlayersRequired: 'Wymagana minimalna liczba graczy:',
    evenPlayersRequired: 'Wymagana parzysta liczba graczy',
    roundModeLabel: 'Tryb rund',
    roundModeFixed: 'Określona liczba',
    roundModeUnlimited: 'Nielimitowane',
    byePoints: '+11 pkt za pauzę',

    rankingPriority: 'Priorytet rankingu i parowania',
    rankingPriorityDesc: 'Decyduje o kolejności w tabeli i parowaniu w Mexicano.',
    priorityWins: 'Wygrane',
    priorityLabel: 'Priorytet',

    searchTournaments: 'Szukaj turnieju...',
    filterAll: 'Wszystkie',
    filterActive: 'Aktywne',
    filterFinished: 'Zakończone',
    previousPage: 'Poprzednia',
    nextPage: 'Następna',
    pageOf: 'z',
};

const en: Translations = {
    appName: 'Baza Padel Tournament',
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

    sortResults: 'Sort by',
    sortByPoints: 'By Points',
    sortByWins: 'By Wins',
    lastMatch: 'Last Match',
    lastMatchConfirm: 'Are you sure you want to play the last match?',
    lastMatchWarning: 'The tournament will end after entering the scores.',
    previousRounds: 'Previous Rounds',
    repeatTournament: 'Repeat Tournament',
    repeatTournamentDesc: 'Create a new tournament with the same settings',

    confirmDelete: 'Are you sure you want to delete this tournament?',
    cancel: 'Cancel',
    confirm: 'Confirm',
    close: 'Close',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    minPlayersRequired: 'Minimum players required:',
    evenPlayersRequired: 'Even number of players required',
    roundModeLabel: 'Round mode',
    roundModeFixed: 'Fixed rounds',
    roundModeUnlimited: 'Unlimited',
    byePoints: '+11 pts bye',

    rankingPriority: 'Ranking & Pairing Priority',
    rankingPriorityDesc: 'Determines how leaderboard is sorted and how matches are paired in Mexicano.',
    priorityWins: 'Wins',
    priorityLabel: 'Priority',

    searchTournaments: 'Search tournaments...',
    filterAll: 'All',
    filterActive: 'Active',
    filterFinished: 'Finished',
    previousPage: 'Previous',
    nextPage: 'Next',
    pageOf: 'of',
};

const de: Translations = {
    appName: 'Baza Padel Tournament',
    newTournament: 'Neues Turnier',
    continueTournament: 'Fortsetzen',
    deleteTournament: 'Turnier löschen',
    noTournaments: 'Keine gespeicherten Turniere. Erstelle dein erstes Turnier!',
    savedTournaments: 'Gespeicherte Turniere',
    backToHome: 'Startseite',
    language: 'Sprache',

    formatAmericano: 'Americano',
    formatMixedAmericano: 'Mixed Americano',
    formatTeamAmericano: 'Team Americano',
    formatMexicano: 'Mexicano',
    formatTeamMexicano: 'Team Mexicano',
    formatAmericanoDesc: 'Klassisches Format — jeder spielt mit jedem in Rotation. Einzelwertung.',
    formatMixedAmericanoDesc: 'Paare bestehen immer aus Mann + Frau. Einzelwertung.',
    formatTeamAmericanoDesc: 'Feste 2er-Teams. Teamwertung.',
    formatMexicanoDesc: 'Dynamische Paarung nach Rangliste. Je besser du spielst, desto stärker die Gegner.',
    formatTeamMexicanoDesc: 'Feste Teams — Spiele basierend auf der aktuellen Teamrangliste.',

    setupTitle: 'Turnier-Einrichtung',
    stepFormat: 'Format',
    stepPlayers: 'Spieler',
    stepSettings: 'Einstellungen',
    stepReview: 'Überprüfung',
    selectFormat: 'Turnierformat auswählen',
    addPlayers: 'Spieler hinzufügen',
    playerName: 'Spielername',
    addPlayer: 'Spieler hinzufügen',
    removePlayer: 'Entfernen',
    tournamentName: 'Turniername',
    numberOfCourts: 'Anzahl der Plätze',
    scoringSystem: 'Punktesystem',
    pointsPerMatch: 'Punkte pro Spiel',
    startTournament: 'Turnier starten',
    next: 'Weiter',
    back: 'Zurück',
    review: 'Überprüfung',
    players: 'Spieler',
    courts: 'Plätze',
    format: 'Format',
    gender: 'Geschlecht',
    male: 'Männlich',
    female: 'Weiblich',
    teamName: 'Teamname',
    addTeam: 'Team hinzufügen',
    assignToTeam: 'Dem Team zuweisen',

    matches: 'Spiele',
    leaderboard: 'Rangliste',
    stats: 'Statistiken',
    round: 'Runde',
    currentRound: 'Aktuelle Runde',
    court: 'Platz',
    vs: 'vs',
    score: 'Ergebnis',
    enterScore: 'Ergebnis eingeben',
    saveScore: 'Ergebnis speichern',
    nextRound: 'Nächste Runde',
    finishTournament: 'Turnier beenden',
    sittingOut: 'Pausieren',
    allMatchesCompleted: 'Alle Spiele abgeschlossen',
    enterAllScores: 'Alle Spielergebnisse eingeben, um fortzufahren',
    roundOf: 'von',

    position: 'Pos.',
    player: 'Spieler',
    points: 'Punkte',
    played: 'Gespielt',
    won: 'Gewonnen',
    lost: 'Verloren',
    diff: '+/-',

    results: 'Ergebnisse',
    tournamentResults: 'Turnierergebnisse',
    champion: 'Meister',
    podium: 'Podium',
    finalStandings: 'Endstand',
    matchHistory: 'Spielverlauf',
    shareResults: 'Ergebnisse teilen',
    linkCopied: 'Link kopiert!',
    shareDescription: 'Teile einen Link mit den Turnierergebnissen',
    pointsTotal: 'Gesamtpunkte',
    matchesTotal: 'Spiele gesamt',

    sortResults: 'Sortieren',
    sortByPoints: 'Nach Punkten',
    sortByWins: 'Nach Siegen',
    lastMatch: 'Letztes Spiel',
    lastMatchConfirm: 'Möchtest du wirklich das letzte Spiel spielen?',
    lastMatchWarning: 'Das Turnier endet nach der Eingabe der Ergebnisse.',
    previousRounds: 'Vorherige Runden',
    repeatTournament: 'Turnier wiederholen',
    repeatTournamentDesc: 'Erstelle ein neues Turnier mit denselben Einstellungen',

    confirmDelete: 'Möchtest du dieses Turnier wirklich löschen?',
    cancel: 'Abbrechen',
    confirm: 'Bestätigen',
    close: 'Schließen',
    error: 'Fehler',
    success: 'Erfolg',
    warning: 'Warnung',
    minPlayersRequired: 'Mindestanzahl an Spielern erforderlich:',
    evenPlayersRequired: 'Gerade Anzahl an Spielern erforderlich',
    roundModeLabel: 'Rundenmodus',
    roundModeFixed: 'Feste Runden',
    roundModeUnlimited: 'Unbegrenzt',
    byePoints: '+11 Pkt Freilos',

    rankingPriority: 'Ranglisten- & Paarungspriorität',
    rankingPriorityDesc: 'Bestimmt die Sortierung der Rangliste und die Paarungen im Mexicano.',
    priorityWins: 'Siege',
    priorityLabel: 'Priorität',

    searchTournaments: 'Turnier suchen...',
    filterAll: 'Alle',
    filterActive: 'Aktiv',
    filterFinished: 'Beendet',
    previousPage: 'Zurück',
    nextPage: 'Weiter',
    pageOf: 'von',
};

export const translations: Record<Locale, Translations> = { pl, en, de };

export function getTranslations(locale: Locale): Translations {
    return translations[locale];
}
