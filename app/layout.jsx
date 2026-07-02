import './globals.css'

export const metadata = {
  title: 'Notatki — CRUD z backendem',
  description: 'Aplikacja CRUD: Next.js API routes + Supabase (Postgres).',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  )
}
