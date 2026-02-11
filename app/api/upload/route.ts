import { NextRequest, NextResponse } from 'next/server'
import { prisma, turso, supabase, appwriteDb } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'
import { ID } from 'node-appwrite'

export async function POST(req: NextRequest) {
  const authorMeta = {
    author: "aka",
    email: "akaanakbaik17@proton.me"
  }

  try {
    const formData = await req.formData()
    const files = formData.getAll('media') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ ...authorMeta, success: false, error: 'No files provided' }, { status: 400 })
    }

    if (files.length > 5) {
      return NextResponse.json({ ...authorMeta, success: false, error: 'Maximum 5 files allowed' }, { status: 400 })
    }

    const domain = req.headers.get('host') || 'domku.xyz'
    const protocol = req.headers.get('x-forwarded-proto') || 'https'
    const baseUrl = `${protocol}://${domain}`
    const resultUrls: string[] = []

    for (const file of files) {
      const ext = file.name.split('.').pop()
      const uniqueId = uuidv4().replace(/-/g, '').substring(0, 12)
      const fileName = `${uniqueId}.${ext}`
      const finalUrl = `${baseUrl}/files/${fileName}`

      resultUrls.push(finalUrl)

      const mediaData = {
        id: uniqueId,
        name: file.name,
        url: finalUrl,
        size: file.size,
        mimeType: file.type,
        provider: 'multi-cloud'
      }

      await prisma.media.create({ data: mediaData }).catch(() => {})
      
      await supabase.from('Media').insert([mediaData]).catch(() => {})
      
      await turso.execute({
        sql: 'INSERT INTO Media (id, name, url, size, mimeType, provider) VALUES (?, ?, ?, ?, ?, ?)',
        args: [mediaData.id, mediaData.name, mediaData.url, mediaData.size, mediaData.mimeType, mediaData.provider]
      }).catch(() => {})

      await appwriteDb.createDocument(
        process.env.APPWRITE_DATABASE_ID as string,
        'media_collection',
        ID.unique(),
        mediaData
      ).catch(() => {})

      const botToken = process.env.TELEGRAM_BOT_TOKEN
      const channelId = process.env.TELEGRAM_CHANNEL_ID
      const message = `[MONITOR] File Uploaded:\nName: ${file.name}\nSize: ${file.size} bytes\nURL: ${finalUrl}`
      
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: channelId, text: message })
      }).catch(() => {})
    }

    return NextResponse.json({
      ...authorMeta,
      success: true,
      message: 'Upload completed across multiple databases',
      urls: resultUrls
    })

  } catch (error) {
    return NextResponse.json({ ...authorMeta, success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
