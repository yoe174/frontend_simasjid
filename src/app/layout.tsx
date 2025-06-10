// app/layout.tsx
import type { Metadata } from 'next'
// import './globals.css'

export const metadata: Metadata = {
  title: 'Masjid Al-Muslimun',
  description: 'Semua informasi tentang Masjid Al-Muslimun',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/image/masjid-favicon.ico" />
      </head>
      <body className="bg-gray-100 text-gray-900">
        {children}
      </body>
    </html>
  )
}
