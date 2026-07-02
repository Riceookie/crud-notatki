import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

// Zawsze wykonuj na żądanie (nie cache'uj / nie prerenderuj przy buildzie).
export const dynamic = 'force-dynamic'

// GET /api/notes — odczyt (READ): lista wszystkich notatek, najnowsze na górze.
export async function GET() {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// POST /api/notes — utworzenie (CREATE): dodaje nową notatkę.
export async function POST(req) {
  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Nieprawidłowy JSON w żądaniu.' }, { status: 400 })
  }

  const title = String(body.title ?? '').trim()
  const content = String(body.content ?? '').trim()

  // Walidacja po stronie serwera — pusty tytuł jest niedozwolony.
  if (!title) {
    return NextResponse.json({ error: 'Tytuł jest wymagany.' }, { status: 400 })
  }

  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('notes')
      .insert({ title, content })
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
