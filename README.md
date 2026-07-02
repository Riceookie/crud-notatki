# Notatki — CRUD z backendem

Aplikacja realizująca zadanie **„CRUD z backendem"**: pełny Create/Read/Update/Delete
na prawdziwym backendzie, z danymi trzymanymi po stronie serwera (przeżywają restart).

## Stos

- **Next.js (App Router)** — frontend + **własne endpointy REST** w `app/api/notes`.
- **Supabase (Postgres)** — baza danych, używana wyłącznie po stronie serwera.
- Deploy: **Vercel**.

## API (własne endpointy)

| Metoda | Ścieżka           | Operacja        |
|--------|-------------------|-----------------|
| GET    | `/api/notes`      | lista notatek   |
| POST   | `/api/notes`      | utwórz notatkę  |
| PUT    | `/api/notes/:id`  | edytuj notatkę  |
| DELETE | `/api/notes/:id`  | usuń notatkę    |

Walidacja po stronie serwera: pusty tytuł → `400`. Nieistniejące id przy edycji → `404`.

## Konfiguracja (raz)

1. **Supabase** → utwórz projekt → SQL Editor → wklej i uruchom `supabase/schema.sql`.
2. Skopiuj dane z Supabase → Project Settings → API:
   - `SUPABASE_URL` (Project URL)
   - `SUPABASE_SERVICE_ROLE_KEY` (klucz `service_role` — sekret!)
3. Lokalnie: skopiuj `.env.local.example` → `.env.local` i uzupełnij.
4. Na produkcji: te same dwie zmienne w **Vercel → Settings → Environment Variables**.

## Uruchomienie lokalne

```bash
npm install
npm run dev
# http://localhost:3000
```

## Deploy na Vercel

Zaimportuj repo w Vercel, dodaj dwie zmienne środowiskowe i wdróż.
Każdy push do `main` = automatyczny redeploy.
