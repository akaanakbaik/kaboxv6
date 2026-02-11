"use client"
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Home, Book } from 'lucide-react'
import Link from 'next/link'

export default function Header({ locale }: { locale: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center transition-all">
        <div className="flex items-center gap-3">
          <img 
            src="https://raw.githubusercontent.com/akaanakbaik/my-cdn/main/logokaboxnobg.png" 
            alt="Domku Box" 
            className="w-9 h-9 object-contain" 
          />
          <h1 className="text-xl font-extrabold text-white tracking-wide">domku box</h1>
        </div>
        <button onClick={() => setIsOpen(true)} className="text-white hover:text-blue-400 transition-colors">
          <Menu size={28} />
        </button>
      </header>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[75%] md:w-[350px] bg-neutral-950 border-l border-white/10 z-50 p-6 shadow-2xl flex flex-col"
            >
              <div className="flex justify-end">
                <button onClick={() => setIsOpen(false)} className="text-white hover:text-red-400 transition-colors bg-white/5 p-2 rounded-full">
                  <X size={24} />
                </button>
              </div>
              <nav className="mt-10 flex flex-col gap-4">
                <Link href={`/${locale}/~`} onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-lg text-gray-300 hover:text-white hover:bg-white/5 p-3 rounded-xl transition-all">
                  <Home size={22} className="text-blue-400" /> Beranda
                </Link>
                <Link href={`/${locale}/docs`} onClick={() => setIsOpen(false)} className="flex items-center gap-4 text-lg text-gray-300 hover:text-white hover:bg-white/5 p-3 rounded-xl transition-all">
                  <Book size={22} className="text-purple-400" /> API Docs
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
