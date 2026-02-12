"use client"
import { motion } from 'framer-motion'
import { Server, Activity } from 'lucide-react'

export default function ApiDocs() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="w-full max-w-3xl flex flex-col gap-6 mt-6 px-2"
    >
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl font-bold text-white">API Documentation</h1>
        <p className="text-gray-400 text-xs mt-2">Integrasi sistem multi-CDN Domku Box.</p>
      </div>

      <div className="grid gap-4">
        <div className="bg-[#111] border border-white/10 rounded-xl p-5 hover:border-blue-500/30 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Server className="text-blue-400" size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-blue-900/30 text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-blue-900/50">POST</span>
                <span className="text-sm font-mono text-gray-200">/api/upload</span>
              </div>
              <p className="text-gray-500 text-[10px] mt-0.5">Upload media (Max 5 files)</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-[10px] uppercase text-gray-500 font-bold mb-1.5">cURL Example</p>
              <div className="bg-black rounded-lg p-3 font-mono text-[10px] border border-white/5 overflow-x-auto text-gray-300 whitespace-pre">
{`curl -X POST https://domku.xyz/api/upload \\
  -F "media=@photo.jpg"`}
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase text-gray-500 font-bold mb-1.5">Response</p>
              <div className="bg-black rounded-lg p-3 font-mono text-[10px] border border-white/5 overflow-x-auto text-green-400 whitespace-pre">
{`{
  "success": true,
  "urls": ["https://domku.xyz/files/abc.jpg"]
}`}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-xl p-5 hover:border-purple-500/30 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Activity className="text-purple-400" size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-green-900/30 text-green-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-green-900/50">GET</span>
                <span className="text-sm font-mono text-gray-200">/api/health</span>
              </div>
              <p className="text-gray-500 text-[10px] mt-0.5">Cek status sistem & database</p>
            </div>
          </div>
          <div className="bg-black rounded-lg p-3 font-mono text-[10px] border border-white/5 overflow-x-auto text-purple-300 whitespace-pre">
{`{
  "status": "healthy",
  "details": { "prisma": "connected", "supabase": "connected" }
}`}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
