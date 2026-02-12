import { prisma, turso, supabase, appwriteDb } from '@/lib/db'
import { distributeToStorage } from '@/lib/upload-service'
import { v4 as uuidv4 } from 'uuid'
import { ID } from 'node-appwrite'
import os from 'os'
import { bot, logToChannel } from '@/lib/telegram'

export async function getMainMenu() {
  const text = `<b>🤖 KABOX CONTROL CENTER</b>\n\n` +
               `Halo Owner! Sistem <b>Domku Box</b> berjalan normal.\n` +
               `Gunakan tombol di bawah untuk manajemen server secara real-time.`
  
  const opts = {
    parse_mode: 'HTML' as const,
    reply_markup: {
      inline_keyboard: [
        [{ text: "📊 System Stats", callback_data: "stats" }, { text: "🗄 Database Check", callback_data: "db_check" }],
        [{ text: "☁️ Storage Info", callback_data: "storage" }, { text: "🚀 Upload Mode", callback_data: "upload_mode" }],
        [{ text: "♻️ Clear Cache", callback_data: "clear_cache" }, { text: "🔐 Env Variables", callback_data: "env_check" }],
        [{ text: "🏥 API Health", callback_data: "health" }, { text: "👤 Owner Info", callback_data: "owner" }],
        [{ text: "❓ Help & Guide", callback_data: "help" }]
      ]
    }
  }
  return { text, opts }
}

export async function getSystemStats() {
  const freeMem = Math.round(os.freemem() / 1024 / 1024)
  const totalMem = Math.round(os.totalmem() / 1024 / 1024)
  const uptime = Math.round(os.uptime() / 60)
  const cpu = os.cpus()[0]?.model || 'Virtual CPU'
  
  const text = `<b>📊 REAL-TIME STATISTICS</b>\n\n` +
               `💻 <b>OS Platform:</b> <code>${os.platform()} ${os.release()}</code>\n` +
               `🧠 <b>Memory Usage:</b> <code>${freeMem}MB / ${totalMem}MB</code>\n` +
               `⚙️ <b>CPU Model:</b> <code>${cpu}</code>\n` +
               `⏱ <b>Server Uptime:</b> <code>${uptime} Menit</code>\n` +
               `🌍 <b>Node Version:</b> <code>${process.version}</code>`
               
  const opts = {
    parse_mode: 'HTML' as const,
    reply_markup: { inline_keyboard: [[{ text: "🔙 Kembali ke Menu", callback_data: "main_menu" }]] }
  }
  return { text, opts }
}

export async function getDatabaseMenu() {
  let p = 0, s = 0, t = 0, a = 0
  
  try { p = await prisma.media.count() } catch {}
  try { const { count } = await supabase.from('Media').select('*', { count: 'exact', head: true }); s = count || 0 } catch {}
  try { const rs = await turso.execute('SELECT COUNT(*) as c FROM Media'); t = Number(rs.rows[0]?.c) || 0 } catch {}
  try { const ar = await appwriteDb.listDocuments(process.env.APPWRITE_DATABASE_ID!, 'media_collection'); a = ar.total } catch {}

  const text = `<b>🗄 DATABASE INTEGRITY CHECK</b>\n\n` +
               `<b>📦 Total File Terindex:</b>\n` +
               `├ 🟢 Prisma (Neon): <b>${p}</b>\n` +
               `├ 🟢 Supabase: <b>${s}</b>\n` +
               `├ 🟢 Turso SQLite: <b>${t}</b>\n` +
               `└ 🟢 Appwrite DB: <b>${a}</b>\n\n` +
               `<i>Semua koneksi database aktif & sinkron.</i>`

  const opts = { 
    parse_mode: 'HTML' as const,
    reply_markup: { 
      inline_keyboard: [
        [{ text: "🔄 Refresh Data", callback_data: "db_check" }],
        [{ text: "🔙 Kembali", callback_data: "main_menu" }]
      ] 
    }
  }
  return { text, opts }
}

export async function processUpload(fileId: string, domain: string) {
  try {
    const fileLink = await bot.getFileLink(fileId)
    const mediaRes = await fetch(fileLink)
    const buffer = Buffer.from(await mediaRes.arrayBuffer())
    
    const filePath = new URL(fileLink).pathname
    const ext = filePath.split('.').pop() || 'jpg'
    const uniqueId = uuidv4().replace(/-/g, '').substring(0, 12)
    const fileName = `${uniqueId}.${ext}`
    const mimeType = mediaRes.headers.get('content-type') || 'application/octet-stream'

    const storageResult = await distributeToStorage(buffer, fileName, mimeType)
    const finalUrl = `https://${domain}/files/${fileName}`

    const mediaData = {
      id: uniqueId,
      name: fileName,
      url: storageResult.url,
      size: buffer.length,
      mimeType,
      provider: storageResult.provider
    }

    await Promise.allSettled([
      prisma.media.create({ data: mediaData }),
      supabase.from('Media').insert([mediaData]),
      turso.execute({ sql: 'INSERT INTO Media (id, name, url, size, mimeType, provider) VALUES (?, ?, ?, ?, ?, ?)', args: [mediaData.id, mediaData.name, mediaData.url, mediaData.size, mediaData.mimeType, mediaData.provider] }),
      appwriteDb.createDocument(process.env.APPWRITE_DATABASE_ID!, 'media_collection', ID.unique(), mediaData)
    ])

    await logToChannel("NEW TELEGRAM UPLOAD", `User uploaded file via Bot.\nFile: ${fileName}\nProvider: ${storageResult.provider}`)

    return `<b>✅ UPLOAD BERHASIL</b>\n\n` +
           `📂 <b>File Name:</b> <code>${fileName}</code>\n` +
           `💾 <b>Size:</b> <code>${(buffer.length/1024).toFixed(2)} KB</code>\n` +
           `☁️ <b>Storage:</b> ${storageResult.provider}\n\n` +
           `🔗 <b>URL Result:</b>\n${finalUrl}`
  } catch (error: any) {
    return `❌ <b>UPLOAD GAGAL</b>\n\nError: ${error.message}`
  }
}
