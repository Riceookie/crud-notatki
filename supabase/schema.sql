-- Schemat bazy dla aplikacji „Notatki".
-- Uruchom w Supabase → SQL Editor → New query → Run.

create table if not exists notes (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  content    text not null default '',
  created_at timestamptz not null default now()
);

-- Włączamy Row Level Security (dobra praktyka). Do bazy piszemy WYŁĄCZNIE
-- z serwera (API routes) kluczem service_role, który i tak omija RLS,
-- więc nie dodajemy publicznych polityk — klient anon nie ma dostępu.
alter table notes enable row level security;
