"use client"
import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, File as FileIcon, X, CheckCircle, Copy, ExternalLink, Loader2 } from 'lucide-react'

export default function HomeUploader() {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

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
        setProgress((prev) => {
          if (prev >= 98) return 98
          return prev + 1
        })
      }, 50)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      
      clearInterval(interval)

      if (data.success && data.urls) {
        setProgress(100)
        setResults(data.urls)
      } else {
        setProgress(0)
        alert('Upload failed')
      }
    } catch (error) {
      clearInterval(undefined)
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
      className="w-full max-w-2xl flex flex-col items-center gap-6 mt-10"
    >
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full relative border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${isDragging ? 'border-blue-500 bg-blue-500/10 scale-[1.02]' : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30'}`}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          multiple 
          onChange={handleFileInput} 
          className="hidden" 
        />
        <div className={`p-4 rounded-full mb-4 ${isDragging ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-gray-400'}`}>
          <UploadCloud size={32} />
        </div>
        <h2 className="text-lg font-bold mb-1 text-center text-white">Upload File</h2>
        <p className="text-gray-400 text-xs text-center">Drag & Drop atau Klik (Max 5 File)</p>
      </div>

      <p className="text-[10px] text-gray-500 text-center max-w-md px-4 leading-relaxed">
        web cdn ini gratis, tanpa iklan dan silahkan gunakan dgn baik dgn ketentuan yg berlaku
      </p>

      <AnimatePresence>
        {files.length > 0 && !uploading && results.length === 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="w-full flex flex-col gap-2">
            {files.map((file, i) => (
              <div key={i} className="flex items-center justify-between bg-white/5 border border-white/10 p-3 rounded-lg">
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileIcon size={16} className="text-blue-400 flex-shrink-0" />
                  <span className="truncate text-xs text-gray-300">{file.name}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="text-gray-500 hover:text-red-400">
                  <X size={16} />
                </button>
              </div>
            ))}
            <button onClick={startUpload} className="mt-2 w-full bg-white text-black font-bold py-2.5 rounded-lg hover:bg-gray-200 transition-colors text-sm">
              Mulai Upload
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {uploading && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full space-y-2">
            <div className="flex justify-between text-xs text-gray-400 px-1">
              <span className="flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> Uploading...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
              <motion.div className="bg-blue-500 h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ ease: 'linear', duration: 0.1 }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full grid gap-3">
            <div className="flex items-center justify-center gap-2 mb-2 text-green-400">
              <CheckCircle size={20} />
              <h3 className="text-sm font-bold">Sukses!</h3>
            </div>
            {results.map((url, i) => (
              <div key={i} className="flex items-center gap-2 bg-black/40 border border-white/10 p-2 rounded-lg">
                <input readOnly value={url} className="flex-1 bg-transparent text-[10px] sm:text-xs text-gray-300 focus:outline-none font-mono px-2" />
                <button onClick={() => copyToClipboard(url)} className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white">
                  <Copy size={14} />
                </button>
                <a href={url} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-white/10 rounded text-blue-400 hover:text-blue-300">
                  <ExternalLink size={14} />
                </a>
              </div>
            ))}
            <button onClick={() => { setResults([]); setFiles([]); setProgress(0) }} className="mt-2 text-xs text-gray-500 hover:text-white transition-colors">
              Upload Lagi
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
