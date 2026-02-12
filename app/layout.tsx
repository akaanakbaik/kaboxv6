import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Domku Box',
  description: 'Free Unlimited CDN Storage',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen bg-black text-white">
          <main className="flex-grow flex flex-col items-center justify-center p-4 w-full max-w-7xl mx-auto">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
