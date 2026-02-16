# Padel Mixer

A client-side web application for organizing and managing padel tournaments. Supports multiple tournament formats, live score tracking, leaderboards, and shareable results -- all without a backend server.

---

## Table of Contents

- [Features](#features)
- [Tournament Formats](#tournament-formats)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [How to Use](#how-to-use)
- [Project Structure](#project-structure)

---

## Features

- **Multiple tournament formats** -- Americano, Mixed Americano, Team Americano, Mexicano, and Team Mexicano.
- **Configurable scoring** -- choose between 16, 21, 24, or 32 point scoring systems.
- **Multi-court support** -- run matches on multiple courts in parallel.
- **Live score entry** -- enter scores in real time during matches.
- **Automatic scheduling** -- matches and pairings are generated automatically based on the selected format.
- **Dynamic standings** -- leaderboard updates after each completed match.
- **Shareable results** -- generate a URL to share final tournament results with anyone; no account or login required.
- **Offline-first** -- all data is stored in the browser via localStorage. No server, no database.
- **Trilingual** -- supports Polish (default), English, and German, switchable at any time.

---

## Tournament Formats

| Format           | Description                                                                                   |
| ---------------- | --------------------------------------------------------------------------------------------- |
| Americano        | Classic round-robin. Every player partners with and plays against every other player.         |
| Mixed Americano  | Same as Americano but each team always has one male and one female player.                    |
| Team Americano   | Fixed teams play round-robin against all other teams.                                         |
| Mexicano         | Dynamic pairing based on current standings. First round is random, then ranked.               |
| Team Mexicano    | Fixed teams with dynamic matchups based on team standings.                                    |

---

## Tech Stack

| Layer             | Technology                  |
| ----------------- | --------------------------- |
| Framework         | Next.js 16                  |
| Language          | TypeScript 5                |
| UI Library        | React 19                    |
| Styling           | Tailwind CSS 4              |
| State Management  | React Context + useReducer  |
| Persistence       | Browser localStorage        |
| Linting           | ESLint 9                    |

---

## Prerequisites

- **Node.js** -- version 18 or later.
- **npm** -- comes bundled with Node.js.

---

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Padel-Mixer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open the app** in your browser at `http://localhost:3000`.

---

## Available Scripts

| Command          | Description                                    |
| ---------------- | ---------------------------------------------- |
| `npm run dev`    | Start the development server with hot reload.  |
| `npm run build`  | Create an optimized production build.          |
| `npm run start`  | Serve the production build locally.            |
| `npm run lint`   | Run ESLint to check for code issues.           |

---

## How to Use

### Creating a Tournament

1. Open the app and click **New Tournament** on the home page.
2. **Choose a format** -- select one of the five tournament formats.
3. **Add players** -- enter player names one by one. For Mixed Americano, assign a gender (male/female) to each player. For Team formats, create teams and assign players to them.
4. **Configure settings** -- set the tournament name, number of courts, and scoring system (16, 21, 24, or 32 points per match).
5. **Review and start** -- verify the setup on the summary screen and start the tournament.

### Running Matches

- The app displays the current round with all matches and court assignments.
- Players who are sitting out the current round (if there are more players than court slots) are shown separately.
- Enter the score for each match. The total of both scores must equal the chosen scoring system value (e.g., if the system is 24, valid scores are 14-10, 12-12, etc.).
- Once all matches in a round are scored, proceed to the next round.

### Viewing Standings

- The leaderboard is visible during the tournament and updates automatically.
- Players are ranked by total points, then by point difference, then by number of wins.
- For team formats, team standings are shown alongside individual stats.

### Finishing a Tournament

- After the final round, finish the tournament to lock in results and see the final leaderboard.

### Sharing Results

- After a tournament is finished, use the **Share** button to generate a URL.
- Anyone who opens the link will see the full results -- standings, round-by-round scores, and match details -- without needing the app installed or any account.

### Switching Language

- Use the language toggle in the header to switch between Polish, English, and German at any time. The preference is saved in the browser.

### Managing Tournaments

- Saved tournaments are listed on the home page, sorted by last update.
- Active tournaments can be continued from where you left off.
- Tournaments can be deleted from the home page list.

---

## Project Structure

```
src/
  app/
    page.tsx                  -- Home page (tournament list)
    layout.tsx                -- Root layout with metadata and providers
    globals.css               -- Global styles and design tokens
    results/
      page.tsx                -- Shared results viewer (accessed via URL)
    tournament/
      new/
        page.tsx              -- Tournament creation wizard (4 steps)
      [id]/
        page.tsx              -- Active tournament view (matches, scores, standings)
        results/
          page.tsx            -- Tournament results page
  components/
    Header.tsx                -- App header with logo and language toggle
  context/
    AppContext.tsx             -- Global state (React Context + useReducer)
  lib/
    types.ts                  -- TypeScript type definitions
    scheduler.ts              -- Match scheduling and pairing algorithms
    scoring.ts                -- Scoring engine and standings calculation
    share.ts                  -- URL-based result sharing (encode/decode)
    storage.ts                -- localStorage persistence layer
    i18n.ts                   -- Translations (Polish, English, and German)
```

---
---

# Padel Mixer (PL)

Aplikacja webowa do organizacji i prowadzenia turniejow padel. Obsluguje wiele formatow turniejowych, sledzenie wynikow na zywo, tabele wynikow oraz udostepnianie rezultatow -- wszystko bez serwera backendowego.

---

## Spis tresci

- [Funkcje](#funkcje)
- [Formaty turniejowe](#formaty-turniejowe)
- [Stos technologiczny](#stos-technologiczny)
- [Wymagania wstepne](#wymagania-wstepne)
- [Uruchomienie projektu](#uruchomienie-projektu)
- [Dostepne skrypty](#dostepne-skrypty)
- [Jak uzywac](#jak-uzywac)
- [Struktura projektu](#struktura-projektu-1)

---

## Funkcje

- **Wiele formatow turniejowych** -- Americano, Mixed Americano, Team Americano, Mexicano i Team Mexicano.
- **Konfigurowalny system punktacji** -- do wyboru: 16, 21, 24 lub 32 punkty na mecz.
- **Obsluga wielu kortow** -- mecze rozgrywane rownolegle na kilku kortach.
- **Wprowadzanie wynikow na zywo** -- wpisywanie wynikow w trakcie trwania meczy.
- **Automatyczne planowanie meczy** -- pary i mecze generowane automatycznie na podstawie wybranego formatu.
- **Dynamiczna tabela wynikow** -- klasyfikacja aktualizuje sie po kazdym zakonczonym meczu.
- **Udostepnianie wynikow** -- generowanie linku URL do udostepnienia wynikow turnieju dowolnej osobie; bez konta i logowania.
- **Tryb offline** -- wszystkie dane przechowywane w przegladarce (localStorage). Bez serwera, bez bazy danych.
- **Trojjezycznosc** -- obsluga jezyka polskiego (domyslny), angielskiego i niemieckiego, przelaczanie w dowolnym momencie.

---

## Formaty turniejowe

| Format           | Opis                                                                                                 |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| Americano        | Klasyczny round-robin. Kazdy gracz gra w parze z kazdym innym i przeciwko kazdemu innemu.           |
| Mixed Americano  | Jak Americano, ale kazda para sklada sie z jednego mezczyzny i jednej kobiety.                      |
| Team Americano   | Stale druzyny graja kazda z kazda w systemie round-robin.                                            |
| Mexicano         | Dynamiczne parowanie na podstawie aktualnej klasyfikacji. Pierwsza runda losowa, kolejne rankingowe. |
| Team Mexicano    | Stale druzyny z dynamicznym doborem przeciwnikow na podstawie klasyfikacji druzynowej.               |

---

## Stos technologiczny

| Warstwa               | Technologia                 |
| --------------------- | --------------------------- |
| Framework             | Next.js 16                  |
| Jezyk programowania   | TypeScript 5                |
| Biblioteka UI         | React 19                    |
| Stylowanie            | Tailwind CSS 4              |
| Zarzadzanie stanem    | React Context + useReducer  |
| Przechowywanie danych | localStorage przegladarki   |
| Linting               | ESLint 9                    |

---

## Wymagania wstepne

- **Node.js** -- wersja 18 lub nowsza.
- **npm** -- instalowany razem z Node.js.

---

## Uruchomienie projektu

1. **Sklonuj repozytorium**

   ```bash
   git clone <adres-repozytorium>
   cd Padel-Mixer
   ```

2. **Zainstaluj zaleznosci**

   ```bash
   npm install
   ```

3. **Uruchom serwer deweloperski**

   ```bash
   npm run dev
   ```

4. **Otworz aplikacje** w przegladarce pod adresem `http://localhost:3000`.

---

## Dostepne skrypty

| Polecenie        | Opis                                                    |
| ---------------- | ------------------------------------------------------- |
| `npm run dev`    | Uruchamia serwer deweloperski z automatycznym odswiezaniem. |
| `npm run build`  | Tworzy zoptymalizowana wersje produkcyjna.              |
| `npm run start`  | Serwuje wersje produkcyjna lokalnie.                    |
| `npm run lint`   | Uruchamia ESLint w celu sprawdzenia kodu.               |

---

## Jak uzywac

### Tworzenie turnieju

1. Otworz aplikacje i kliknij **Nowy turniej** na stronie glownej.
2. **Wybierz format** -- wybierz jeden z pieciu formatow turniejowych.
3. **Dodaj graczy** -- wpisuj imiona graczy po kolei. W przypadku Mixed Americano przypisz plec (mezczyzna/kobieta) kazdemu graczowi. W formatach druzynowych utworz druzyny i przypisz do nich graczy.
4. **Skonfiguruj ustawienia** -- ustaw nazwe turnieju, liczbe kortow i system punktacji (16, 21, 24 lub 32 punkty na mecz).
5. **Przejrzyj i rozpocznij** -- sprawdz podsumowanie konfiguracji i rozpocznij turniej.

### Prowadzenie meczy

- Aplikacja wyswietla biezaca runde ze wszystkimi meczami i przypisanymi kortami.
- Gracze pauzujacy w danej rundzie (jezeli jest wiecej graczy niz miejsc na kortach) sa wyswietlani osobno.
- Wprowadz wynik kazdego meczu. Suma obu wynikow musi byc rowna wartosci systemu punktacji (np. przy systemie 24 poprawne wyniki to 14-10, 12-12 itp.).
- Po zakonczeniu wszystkich meczy w rundzie przejdz do nastepnej rundy.

### Przegladanie klasyfikacji

- Tabela wynikow jest widoczna w trakcie turnieju i aktualizuje sie automatycznie.
- Gracze sa klasyfikowani wedlug sumy punktow, nastepnie roznicy punktow, a potem liczby zwycieztw.
- W formatach druzynowych klasyfikacja druzynowa wyswietlana jest obok statystyk indywidualnych.

### Zakonczenie turnieju

- Po ostatniej rundzie zakoncz turniej, aby zablokowac wyniki i wyswietlic koncowa klasyfikacje.

### Udostepnianie wynikow

- Po zakonczeniu turnieju uzyj przycisku **Udostepnij**, aby wygenerowac link URL.
- Kazdy, kto otworzy link, zobaczy pelne wyniki -- klasyfikacje, wyniki runda po rundzie i szczegoly meczy -- bez potrzeby instalacji aplikacji czy posiadania konta.

### Zmiana jezyka

- Uzyj przelacznika jezyka w naglowku, aby przelaczac miedzy polskim, angielskim i niemieckim w dowolnym momencie. Preferencja jest zapisywana w przegladarce.

### Zarzadzanie turniejami

- Zapisane turnieje sa wyswietlane na stronie glownej, posortowane wedlug ostatniej aktualizacji.
- Aktywne turnieje mozna kontynuowac od miejsca, w ktorym zostaly przerwane.
- Turnieje mozna usuwac z listy na stronie glownej.

---

## Struktura projektu

```
src/
  app/
    page.tsx                  -- Strona glowna (lista turniejow)
    layout.tsx                -- Glowny uklad z metadanymi i providerami
    globals.css               -- Globalne style i tokeny designu
    results/
      page.tsx                -- Podglad udostepnionych wynikow (dostep przez URL)
    tournament/
      new/
        page.tsx              -- Kreator tworzenia turnieju (4 kroki)
      [id]/
        page.tsx              -- Widok aktywnego turnieju (mecze, wyniki, klasyfikacja)
        results/
          page.tsx            -- Strona wynikow turnieju
  components/
    Header.tsx                -- Naglowek aplikacji z logo i przelacznikiem jezyka
  context/
    AppContext.tsx             -- Globalny stan (React Context + useReducer)
  lib/
    types.ts                  -- Definicje typow TypeScript
    scheduler.ts              -- Algorytmy planowania meczy i parowania graczy
    scoring.ts                -- Silnik punktacji i obliczanie klasyfikacji
    share.ts                  -- Udostepnianie wynikow przez URL (kodowanie/dekodowanie)
    storage.ts                -- Warstwa persystencji localStorage
    i18n.ts                   -- Tlumaczenia (polski, angielski i niemiecki)
```
