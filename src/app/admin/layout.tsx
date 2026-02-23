import { Geist } from 'next/font/google'
import type { Metadata } from 'next'
import '../globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Admin — World Clap Day',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased bg-gray-50 text-gray-900`}>
        {children}
      </body>
    </html>
  )
}
