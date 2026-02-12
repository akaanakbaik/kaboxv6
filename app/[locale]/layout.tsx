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
      <body className={`${inter.className} bg-[#0a0a0a] text-white antialiased`}>
        <div className="flex flex-col min-h-screen">
          <Header locale={locale} />
          <main className="flex-grow pt-24 px-4 sm:px-6 lg:px-8 w-full max-w-6xl mx-auto flex flex-col items-center pb-12">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
