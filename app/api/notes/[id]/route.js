import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// PUT /api/notes/:id — edycja (UPDATE): nadpisuje tytuł i treść notatki o danym id.
export async function PUT(req, { params }) {
  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Nieprawidłowy JSON w żądaniu.' }, { status: 400 })
  }

  const title = String(body.title ?? '').trim()
  const content = String(body.content ?? '').trim()

  if (!title) {
    return NextResponse.json({ error: 'Tytuł jest wymagany.' }, { status: 400 })
  }

  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('notes')
      .update({ title, content })
      .eq('id', params.id)
      .select()
      .maybeSingle()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!data) return NextResponse.json({ error: 'Nie znaleziono notatki.' }, { status: 404 })
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// DELETE /api/notes/:id — usunięcie (DELETE): kasuje notatkę o danym id.
export async function DELETE(_req, { params }) {
  try {
    const supabase = getSupabase()
    const { error } = await supabase.from('notes').delete().eq('id', params.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
