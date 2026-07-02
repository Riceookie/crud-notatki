import { createClient } from '@supabase/supabase-js'

// UWAGA: to są wartości PUBLICZNE, bezpieczne w kodzie frontendu.
// - URL projektu jest jawny.
// - Klucz "anon" jest przeznaczony do przeglądarki; dostęp do danych i tak
//   ograniczają polityki RLS w bazie (patrz supabase/policies.sql).
// NIGDY nie wstawiaj tu klucza "service_role" — on omija RLS.
const SUPABASE_URL = 'https://ejtimrbcuvqokxxkqsjw.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_05XUFePu8cTXboJzSb86rw_WIvYbcEw'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
