"use client"
import { motion } from 'framer-motion'
import { Server, Activity, Copy } from 'lucide-react'

export default function ApiDocs() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="w-full max-w-xl mx-auto flex flex-col gap-5 mt-4 px-4 pb-24"
    >
      <div className="border-b border-white/10 pb-3">
        <h1 className="text-xl font-bold text-white">API Documentation</h1>
        <p className="text-gray-400 text-xs mt-1">Integrasi sistem multi-CDN Domku Box.</p>
      </div>

      <div className="grid gap-3">
        {/* POST ENDPOINT */}
        <div className="bg-[#111] border border-white/10 rounded-xl p-4 shadow-sm">
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 bg-blue-500/10 rounded-lg shrink-0">
              <Server className="text-blue-400" size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-blue-900/20 text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-blue-900/30">POST</span>
                <code className="text-xs font-mono text-gray-200 break-all">/api/upload</code>
              </div>
              <p className="text-gray-500 text-[10px] mt-1 leading-tight">Upload media (Max 5 files, Max 5MB)</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="relative group">
              <div className="flex justify-between items-center mb-1">
                <p className="text-[9px] uppercase text-gray-600 font-bold tracking-wider">cURL Request</p>
              </div>
              <div className="bg-black rounded-lg border border-white/5 w-full overflow-hidden">
                <div className="overflow-x-auto p-3 scrollbar-hide">
                  <pre className="text-[10px] font-mono text-gray-300 whitespace-pre">
{`curl -X POST https://domku.xyz/api/upload \\
  -F "media=@photo.jpg"`}
                  </pre>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[9px] uppercase text-gray-600 font-bold mb-1 tracking-wider">JSON Response</p>
              <div className="bg-black rounded-lg border border-white/5 w-full overflow-hidden">
                <div className="overflow-x-auto p-3 scrollbar-hide">
                  <pre className="text-[10px] font-mono text-green-400 whitespace-pre">
{`{
  "success": true,
  "urls": [
    "https://domku.xyz/files/abc.jpg"
  ]
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GET ENDPOINT */}
        <div className="bg-[#111] border border-white/10 rounded-xl p-4 shadow-sm">
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 bg-purple-500/10 rounded-lg shrink-0">
              <Activity className="text-purple-400" size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-green-900/20 text-green-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-green-900/30">GET</span>
                <code className="text-xs font-mono text-gray-200 break-all">/api/health</code>
              </div>
              <p className="text-gray-500 text-[10px] mt-1 leading-tight">Monitoring status database realtime</p>
            </div>
          </div>
          
          <div>
            <p className="text-[9px] uppercase text-gray-600 font-bold mb-1 tracking-wider">JSON Response</p>
            <div className="bg-black rounded-lg border border-white/5 w-full overflow-hidden">
              <div className="overflow-x-auto p-3 scrollbar-hide">
                <pre className="text-[10px] font-mono text-purple-300 whitespace-pre">
{`{
  "status": "healthy",
  "details": {
    "prisma": "connected",
    "supabase": "connected"
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
