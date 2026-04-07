import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Soli \u1236\u120A \u2014 My English Teacher',
  description: 'Learn English with Soli. Fun, interactive, voice-first.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="am">
      <body className="min-h-screen bg-cream">{children}</body>
    </html>
  )
}
