export default function Footer() {
  return (
    <footer className="w-full py-6 text-center text-xs text-zinc-600 border-t border-zinc-900 bg-black mt-10">
      <div className="max-w-7xl mx-auto px-4">
        <p className="mb-2 font-semibold tracking-wider uppercase">Domku Box CDN</p>
        <p>&copy; {new Date().getFullYear()} All Rights Reserved. Built for speed.</p>
      </div>
    </footer>
  )
}
