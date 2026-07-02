-- Uruchom w Supabase → SQL Editor → New query → Run.
-- Zakłada, że tabela `notes` już istnieje (utworzona wcześniej).

-- 1) Walidacja PO STRONIE SERWERA: tytuł nie może być pusty.
--    Baza odrzuci taki zapis niezależnie od frontendu.
alter table notes
  add constraint notes_title_not_blank check (char_length(btrim(title)) > 0);

-- 2) Polityki RLS pozwalające przeglądarce (rola anon/authenticated) na CRUD.
--    To publiczna aplikacja demonstracyjna bez logowania — każdy może czytać
--    i zmieniać notatki. (Logowanie i ograniczenia dojdą w kolejnym zadaniu.)
create policy "notes_select" on notes for select using (true);
create policy "notes_insert" on notes for insert with check (true);
create policy "notes_update" on notes for update using (true) with check (true);
create policy "notes_delete" on notes for delete using (true);
