// ==========================================
// LocalStorage Persistence
// ==========================================

import { Tournament } from './types';

const STORAGE_KEY = 'padel_tournaments';
const LOCALE_KEY = 'padel_locale';

export function saveTournament(tournament: Tournament): void {
    if (typeof window === 'undefined') return;
    const tournaments = listTournaments();
    const idx = tournaments.findIndex((t) => t.id === tournament.id);
    if (idx >= 0) {
        tournaments[idx] = { ...tournament, updatedAt: new Date().toISOString() };
    } else {
        tournaments.push(tournament);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tournaments));
}

export function loadTournament(id: string): Tournament | null {
    if (typeof window === 'undefined') return null;
    const tournaments = listTournaments();
    return tournaments.find((t) => t.id === id) || null;
}

export function listTournaments(): Tournament[] {
    if (typeof window === 'undefined') return [];
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return [];
        return JSON.parse(data) as Tournament[];
    } catch {
        return [];
    }
}

export function deleteTournament(id: string): void {
    if (typeof window === 'undefined') return;
    const tournaments = listTournaments().filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tournaments));
}

export function saveLocale(locale: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LOCALE_KEY, locale);
}

export function loadLocale(): string {
    if (typeof window === 'undefined') return 'pl';
    return localStorage.getItem(LOCALE_KEY) || 'pl';
}
