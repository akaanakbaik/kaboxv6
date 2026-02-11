"use client"
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, File as FileIcon, X, CheckCircle, Copy, ExternalLink, Loader2 } from 'lucide-react'

export default function HomeUploader() {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<string[]>([])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    if (files.length + droppedFiles.length > 5) return
    setFiles((prev) => [...prev, ...droppedFiles].slice(0, 5))
  }, [files])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      if (files.length + selectedFiles.length > 5) return
      setFiles((prev) => [...prev, ...selectedFiles].slice(0, 5))
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const startUpload = async () => {
    if (files.length === 0) return
    setUploading(true)
    setProgress(0)
    
    const formData = new FormData()
    files.forEach((file) => formData.append('media', file))

    try {
      const interval = setInterval(() => {
        setProgress((p) => (p < 90 ? p + 10 : p))
      }, 500)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      clearInterval(interval)
      setProgress(100)
      
      const data = await response.json()
      if (data.success && data.urls) {
        setResults(data.urls)
      }
    } catch (error) {
      setProgress(0)
    } finally {
      setTimeout(() => setUploading(false), 1000)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="w-full max-w-3xl flex flex-col items-center gap-8 mt-10"
    >
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full relative border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all duration-300 ${isDragging ? 'border-blue-500 bg-blue-500/10 scale-105' : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40'}`}
      >
        <input 
          type="file" 
          multiple 
          onChange={handleFileInput} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
        />
        <UploadCloud size={64} className={`mb-4 transition-colors ${isDragging ? 'text-blue-400' : 'text-gray-400'}`} />
        <h2 className="text-xl font-bold mb-2 text-center text-white">Tarik & Lepas Media di Sini</h2>
        <p className="text-gray-400 text-sm mb-4 text-center">Atau klik untuk memilih file (Maks 5 File)</p>
      </div>

      <AnimatePresence>
        {files.length > 0 && !uploading && results.length === 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="w-full flex flex-col gap-3">
            {files.map((file, i) => (
              <div key={i} className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-xl">
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileIcon className="text-blue-400 flex-shrink-0" />
                  <span className="truncate text-sm text-gray-200">{file.name}</span>
                </div>
                <button onClick={() => removeFile(i)} className="text-gray-400 hover:text-red-400 transition-colors">
                  <X size={20} />
                </button>
              </div>
            ))}
            <button onClick={startUpload} className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-blue-500/25 transition-all transform hover:scale-105 active:scale-95 self-center">
              Mulai Upload
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {uploading && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full flex flex-col items-center gap-4 bg-white/5 border border-white/10 p-8 rounded-3xl">
            <Loader2 size={48} className="text-blue-500 animate-spin" />
            <div className="w-full bg-black/50 rounded-full h-3 overflow-hidden border border-white/10">
              <motion.div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ ease: 'linear' }} />
            </div>
            <p className="text-white font-bold text-lg">{progress}% Mengunggah...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full grid gap-4">
            <div className="flex items-center justify-center gap-2 mb-4 text-green-400">
              <CheckCircle size={28} />
              <h3 className="text-xl font-bold">Berhasil Diunggah!</h3>
            </div>
            {results.map((url, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-center justify-between bg-white/5 border border-white/10 p-4 rounded-2xl gap-4">
                <input readOnly value={url} className="w-full bg-black/50 border border-white/10 rounded-lg py-2 px-3 text-sm text-gray-300 focus:outline-none" />
                <div className="flex gap-2 w-full sm:w-auto">
                  <button onClick={() => copyToClipboard(url)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium">
                    <Copy size={16} /> Salin
                  </button>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 py-2 px-4 rounded-lg transition-colors text-sm font-medium">
                    <ExternalLink size={16} /> Buka
                  </a>
                </div>
              </div>
            ))}
            <button onClick={() => { setResults([]); setFiles([]); setProgress(0) }} className="mt-4 text-gray-400 hover:text-white transition-colors text-sm underline underline-offset-4 self-center">
              Unggah File Lainnya
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
