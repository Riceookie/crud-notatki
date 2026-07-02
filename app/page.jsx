'use client'

import { useEffect, useState } from 'react'

// Prosty helper: wywołanie naszego własnego API i zwrócenie JSON-a.
// Rzuca błędem z komunikatem z serwera, jeśli odpowiedź nie jest OK.
async function api(path, options) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Błąd ${res.status}`)
  return data
}

export default function Home() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Formularz dodawania.
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)

  // Edycja w miejscu.
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  // READ — pobierz listę z /api/notes.
  async function load() {
    setLoading(true)
    setError(null)
    try {
      setNotes(await api('/api/notes'))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  // CREATE — dodaj notatkę.
  async function addNote(e) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const created = await api('/api/notes', {
        method: 'POST',
        body: JSON.stringify({ title, content }),
      })
      setNotes((prev) => [created, ...prev])
      setTitle('')
      setContent('')
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
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
    try {
      const updated = await api(`/api/notes/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ title: editTitle, content: editContent }),
      })
      setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)))
      setEditingId(null)
    } catch (e) {
      setError(e.message)
    }
  }

  // DELETE — usuń notatkę.
  async function removeNote(id) {
    if (!confirm('Usunąć tę notatkę?')) return
    setError(null)
    try {
      await api(`/api/notes/${id}`, { method: 'DELETE' })
      setNotes((prev) => prev.filter((n) => n.id !== id))
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <main className="wrap">
      <header className="head">
        <h1>📝 Notatki</h1>
        <p className="muted">
          CRUD na prawdziwym backendzie: <strong>Next.js API</strong> +{' '}
          <strong>Supabase (Postgres)</strong>. Dane żyją na serwerze i przeżywają restart.
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
        Zadanie: CRUD z backendem · REST API (własne endpointy) · trwałe dane w Postgresie
      </footer>
    </main>
  )
}
