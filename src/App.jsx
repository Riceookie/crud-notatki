import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient.js'

// Aplikacja CRUD: przeglądarka rozmawia bezpośrednio z Supabase (Postgres)
// przez bibliotekę supabase-js. Dane żyją na serwerze i przeżywają restart.
export default function App() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)

  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  // READ — pobierz notatki (najnowsze na górze).
  async function load() {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setNotes(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  // CREATE — dodaj notatkę.
  async function addNote(e) {
    e.preventDefault()
    setError(null)
    if (!title.trim()) {
      setError('Tytuł jest wymagany.')
      return
    }
    setSaving(true)
    const { data, error } = await supabase
      .from('notes')
      .insert({ title: title.trim(), content: content.trim() })
      .select()
      .single()
    setSaving(false)
    if (error) {
      setError(error.message)
      return
    }
    setNotes((prev) => [data, ...prev])
    setTitle('')
    setContent('')
  }

  function startEdit(note) {
    setEditingId(note.id)
    setEditTitle(note.title)
    setEditContent(note.content || '')
    setError(null)
  }

  // UPDATE — zapisz edycję.
  async function saveEdit(id) {
    setError(null)
    if (!editTitle.trim()) {
      setError('Tytuł jest wymagany.')
      return
    }
    const { data, error } = await supabase
      .from('notes')
      .update({ title: editTitle.trim(), content: editContent.trim() })
      .eq('id', id)
      .select()
      .single()
    if (error) {
      setError(error.message)
      return
    }
    setNotes((prev) => prev.map((n) => (n.id === id ? data : n)))
    setEditingId(null)
  }

  // DELETE — usuń notatkę.
  async function removeNote(id) {
    if (!confirm('Usunąć tę notatkę?')) return
    setError(null)
    const { error } = await supabase.from('notes').delete().eq('id', id)
    if (error) {
      setError(error.message)
      return
    }
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <main className="wrap">
      <header className="head">
        <h1>📝 Notatki</h1>
        <p className="muted">
          CRUD na prawdziwym backendzie: <strong>Supabase (Postgres)</strong>.
          Dane żyją na serwerze i przeżywają restart oraz odświeżenie strony.
        </p>
      </header>

      {/* CREATE */}
      <form className="card form" onSubmit={addNote}>
        <input
          className="input"
          placeholder="Tytuł notatki *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="input"
          placeholder="Treść (opcjonalnie)"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="btn" disabled={saving}>
          {saving ? 'Dodaję…' : '+ Dodaj notatkę'}
        </button>
      </form>

      {error && <p className="banner error">⚠️ {error}</p>}

      {/* READ */}
      {loading ? (
        <p className="muted">Ładowanie…</p>
      ) : notes.length === 0 ? (
        <p className="muted empty">Brak notatek. Dodaj pierwszą powyżej 👆</p>
      ) : (
        <ul className="list">
          {notes.map((n) => (
            <li key={n.id} className="card note">
              {editingId === n.id ? (
                <div className="edit">
                  <input
                    className="input"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <textarea
                    className="input"
                    rows={3}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                  <div className="row">
                    <button className="btn" onClick={() => saveEdit(n.id)}>Zapisz</button>
                    <button className="btn ghost" onClick={() => setEditingId(null)}>Anuluj</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="note-head">
                    <h3>{n.title}</h3>
                    <div className="row">
                      <button className="btn ghost sm" onClick={() => startEdit(n)}>Edytuj</button>
                      <button className="btn danger sm" onClick={() => removeNote(n.id)}>Usuń</button>
                    </div>
                  </div>
                  {n.content && <p className="body">{n.content}</p>}
                  <p className="stamp">
                    {n.created_at ? new Date(n.created_at).toLocaleString('pl-PL') : ''}
                  </p>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <footer className="foot">
        Zadanie: CRUD z backendem · Supabase (Postgres) · dane trwałe po stronie serwera
      </footer>
    </main>
  )
}
