import { prisma, turso, supabase, appwriteDb } from '@/lib/db'
import { distributeToStorage } from '@/lib/upload-service'
import { v4 as uuidv4 } from 'uuid'
import { ID } from 'node-appwrite'
import os from 'os'

export function getSystemStats() {
  const freeMem = Math.round(os.freemem() / 1024 / 1024)
  const totalMem = Math.round(os.totalmem() / 1024 / 1024)
  const uptime = Math.round(os.uptime() / 60)
  const cpuModel = os.cpus()[0]?.model || 'Unknown CPU'
  const platform = `${os.platform()} ${os.release()}`

  return `🖥 *SERVER INFO*\n` +
         `💾 RAM: ${freeMem}MB / ${totalMem}MB\n` +
         `⚙️ CPU: ${cpuModel}\n` +
         `📀 OS: ${platform}\n` +
         `⏱ Uptime: ${uptime} Menit`
}

export async function getDatabaseStats() {
  let prismaCount = 0
  let supabaseCount = 0
  let tursoCount = 0
  let appwriteCount = 0
  let status = []

  try { 
    prismaCount = await prisma.media.count()
    status.push("✅ Prisma")
  } catch (e) { status.push("❌ Prisma") }

  try { 
    const { count } = await supabase.from('Media').select('*', { count: 'exact', head: true })
    supabaseCount = count || 0
    status.push("✅ Supabase")
  } catch (e) { status.push("❌ Supabase") }

  try {
    const rs = await turso.execute('SELECT COUNT(*) as count FROM Media')
    tursoCount = Number(rs.rows[0]?.count) || 0
    status.push("✅ Turso")
  } catch (e) { status.push("❌ Turso") }

  try {
    const appwriteRes = await appwriteDb.listDocuments(
      process.env.APPWRITE_DATABASE_ID as string,
      'media_collection'
    )
    appwriteCount = appwriteRes.total
    status.push("✅ Appwrite")
  } catch (e) { status.push("❌ Appwrite") }

  return `📊 *DATABASE REAL-TIME*\n\n` +
         `Status: ${status.join(' | ')}\n` +
         `🔹 Prisma: ${prismaCount} Files\n` +
         `🔹 Supabase: ${supabaseCount} Files\n` +
         `🔹 Turso: ${tursoCount} Files\n` +
         `🔹 Appwrite: ${appwriteCount} Files`
}

export async function processTelegramMedia(fileId: string, botToken: string, domain: string) {
  try {
    const fileRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`)
    const fileData = await fileRes.json()
    if (!fileData.ok) throw new Error('Failed to get file path')

    const filePath = fileData.result.file_path
    const downloadUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`
    
    const mediaRes = await fetch(downloadUrl)
    const buffer = Buffer.from(await mediaRes.arrayBuffer())
    
    const uniqueId = uuidv4().replace(/-/g, '').substring(0, 12)
    const ext = filePath.split('.').pop() || 'jpg'
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
      turso.execute({
        sql: 'INSERT INTO Media (id, name, url, size, mimeType, provider) VALUES (?, ?, ?, ?, ?, ?)',
        args: [mediaData.id, mediaData.name, mediaData.url, mediaData.size, mediaData.mimeType, mediaData.provider]
      }),
      appwriteDb.createDocument(process.env.APPWRITE_DATABASE_ID!, 'media_collection', ID.unique(), mediaData)
    ])

    return finalUrl
  } catch (error) {
    console.error(error)
    return null
  }
}
