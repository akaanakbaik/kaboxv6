import '@/app/globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800'] })

export const metadata = {
  title: 'Domku Box - Modern CDN',
  description: 'Sistem CDN Multi-Storage & Multi-Database by aka',
  icons: {
    icon: 'https://raw.githubusercontent.com/akaanakbaik/my-cdn/main/logokaboxnobg.png'
  }
}

export default function RootLayout({
  children,
  params: { locale }
}: {
  children: ReactNode
  params: { locale: string }
}) {
  return (
    <html lang={locale} className="dark">
      <body className={`${inter.className} bg-[#0a0a0a] text-white antialiased min-h-screen pb-20 selection:bg-blue-500/30`}>
        <Header locale={locale} />
        <main className="pt-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full flex flex-col items-center">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
