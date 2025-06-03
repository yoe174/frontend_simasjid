// app/layout.tsx
import '@/css/website.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aplikasi Saya',
  description: 'Deskripsi aplikasi kamu',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="bg-gray-100 text-gray-900">{children}</body>
    </html>
  )
}
