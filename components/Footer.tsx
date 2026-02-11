export default function Footer() {
  return (
    <footer className="fixed bottom-0 w-full bg-black/80 backdrop-blur-xl py-4 border-t border-white/5 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs z-40 px-4">
      <span className="text-gray-400 flex items-center gap-1">
        created by 
        <a href="https://akadev.me" target="_blank" rel="noopener noreferrer" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white text-sm hover:scale-105 transition-transform">
          aka
        </a>
      </span>
      <span className="text-gray-500">di buat dgn ❤️ dan kode</span>
      <div className="flex gap-4">
        <a href="https://t.me/akamodebaik" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#2AABEE] transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2z"/></svg>
        </a>
        <a href="https://github.com/akaanakbaik" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
        </a>
      </div>
    </footer>
  )
}
