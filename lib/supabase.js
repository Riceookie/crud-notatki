import { createClient } from '@supabase/supabase-js'

// Klient Supabase tworzony leniwie (dopiero przy pierwszym zapytaniu), żeby build
// nie wywalał się, gdy zmienne środowiskowe nie są jeszcze ustawione.
// Używamy klucza SERVICE ROLE — WYŁĄCZNIE po stronie serwera (w API routes),
// nigdy nie trafia do przeglądarki.
let client = null

export function getSupabase() {
  if (client) return client

  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error(
      'Brak konfiguracji Supabase — ustaw SUPABASE_URL i SUPABASE_SERVICE_ROLE_KEY.'
    )
  }

  client = createClient(url, key, { auth: { persistSession: false } })
  return client
}
