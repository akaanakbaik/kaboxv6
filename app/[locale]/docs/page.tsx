"use client"
import { motion } from 'framer-motion'
import { Code, Terminal, Server, ShieldCheck } from 'lucide-react'

export default function ApiDocs() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="w-full max-w-4xl flex flex-col gap-10 mt-10"
    >
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          API Documentation
        </h1>
        <p className="text-gray-400 text-lg">Integrasikan sistem multi-CDN Domku Box ke aplikasimu.</p>
      </div>

      <div className="grid gap-6">
        <div className="bg-[#111] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden group hover:border-blue-500/50 transition-colors">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Server className="text-blue-400" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Upload Media</h2>
              <p className="text-gray-400 text-sm">POST /api/upload</p>
            </div>
          </div>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Endpoint ini digunakan untuk mengunggah hingga 5 file media secara bersamaan. Data akan didistribusikan ke Prisma, Neon, Turso, Supabase, dan Appwrite secara otomatis.
          </p>
          <div className="bg-black/80 rounded-xl p-4 font-mono text-sm border border-white/5 overflow-x-auto mb-6">
            <div className="flex items-center gap-2 mb-2 text-gray-400"><Terminal size={14} /> cURL Example</div>
            <code className="text-green-400">curl -X POST https://domku.xyz/api/upload \</code><br/>
            <code className="text-green-400">  -F "media=@file1.jpg" \</code><br/>
            <code className="text-green-400">  -F "media=@file2.png"</code>
          </div>
          <div className="bg-black/80 rounded-xl p-4 font-mono text-sm border border-white/5 overflow-x-auto">
            <div className="flex items-center gap-2 mb-2 text-gray-400"><Code size={14} /> JSON Response</div>
            <pre className="text-blue-300">
{`{
  "author": "aka",
  "email": "akaanakbaik17@proton.me",
  "success": true,
  "message": "Upload completed across multiple databases",
  "urls": [
    "https://domku.xyz/files/abc12345.jpg",
    "https://domku.xyz/files/xyz98765.png"
  ]
}`}
            </pre>
          </div>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden group hover:border-purple-500/50 transition-colors">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <ShieldCheck className="text-purple-400" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Check Upload Status</h2>
              <p className="text-gray-400 text-sm">GET /files/:id/status</p>
            </div>
          </div>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Gunakan endpoint ini untuk memeriksa progres unggahan di latar belakang secara *real-time*.
          </p>
          <div className="bg-black/80 rounded-xl p-4 font-mono text-sm border border-white/5 overflow-x-auto">
            <pre className="text-purple-300">
{`{
  "author": "aka",
  "email": "akaanakbaik17@proton.me",
  "success": true,
  "data": {
    "id": "abc12345",
    "name": "file.pdf",
    "size": 1048576,
    "status": "completed",
    "downloadUrl": "https://domku.xyz/files/abc12345/download"
  }
}`}
            </pre>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
