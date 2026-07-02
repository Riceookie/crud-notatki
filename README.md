# Notatki — CRUD z backendem

Zadanie **„CRUD z backendem"**: pełny Create/Read/Update/Delete na prawdziwym
backendzie, z danymi trzymanymi po stronie serwera (przeżywają restart).

## Stos

- **Vite + React** — statyczny frontend, hostowany na **GitHub Pages**.
- **Supabase (Postgres)** — backend/baza z gotowym REST API; frontend rozmawia
  z nią przez `@supabase/supabase-js`.

## Operacje CRUD

| Operacja | Metoda supabase-js                          |
|----------|---------------------------------------------|
| Create   | `supabase.from('notes').insert(...)`        |
| Read     | `supabase.from('notes').select('*')`        |
| Update   | `supabase.from('notes').update(...).eq(...)`|
| Delete   | `supabase.from('notes').delete().eq(...)`   |

Walidacja po stronie serwera: ograniczenie `CHECK` w bazie odrzuca pusty tytuł
(patrz `supabase/policies.sql`). Frontend dodatkowo waliduje dla wygody.

## Konfiguracja bazy (raz)

W Supabase → SQL Editor uruchom kolejno:
1. utworzenie tabeli (`notes`: id, title, content, created_at),
2. `supabase/policies.sql` — ograniczenie na tytuł + polityki RLS dla roli `anon`.

Klucze w `src/supabaseClient.js` to wartości **publiczne** (URL + klucz `anon`),
bezpieczne w kodzie frontendu. Klucza `service_role` NIGDY tu nie wstawiamy.

## Uruchomienie lokalne

```bash
npm install
npm run dev
```

## Deploy (GitHub Pages)

```bash
npm run build          # -> dist/
# publikacja zawartości dist/ na branch gh-pages
```
Strona: `https://<user>.github.io/crud-notatki/`
