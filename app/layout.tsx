import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Langu-ify',
  description: 'Learn translation through a tight "Translate → Rate → Teach" loop',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
