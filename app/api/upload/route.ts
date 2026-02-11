export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma, turso, supabase, appwriteDb } from '@/lib/db'
import { distributeToStorage } from '@/lib/upload-service'
import { v4 as uuidv4 } from 'uuid'
import { ID } from 'node-appwrite'

async function processMedia(buffer: Buffer, fileName: string, mimeType: string, fileSize: number, baseUrl: string) {
  const uniqueId = uuidv4().replace(/-/g, '').substring(0, 12)
  const ext = fileName.split('.').pop() || 'bin'
  const newFileName = `${uniqueId}.${ext}`
  const finalUrl = `${baseUrl}/files/${newFileName}`

  const storageResult = await distributeToStorage(buffer, newFileName, mimeType)

  const mediaData = {
    id: uniqueId,
    name: newFileName,
    url: storageResult.url,
    size: fileSize,
    mimeType: mimeType,
    provider: storageResult.provider
  }

  await prisma.media.create({ data: mediaData }).catch(() => {})
  
  try {
    await supabase.from('Media').insert([mediaData])
  } catch (e) {}
  
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

  return finalUrl
}

export async function POST(req: NextRequest) {
  const authorMeta = { author: "aka", email: "akaanakbaik17@proton.me" }
  const domain = req.headers.get('host') || 'domku.xyz'
  const protocol = req.headers.get('x-forwarded-proto') || 'https'
  const baseUrl = `${protocol}://${domain}`
  const urlParam = req.nextUrl.searchParams.get('url')

  try {
    const resultUrls: string[] = []

    if (urlParam) {
      const response = await fetch(urlParam)
      const buffer = Buffer.from(await response.arrayBuffer())
      const mimeType = response.headers.get('content-type') || 'application/octet-stream'
      const fileSize = parseInt(response.headers.get('content-length') || '0', 10)
      const fileName = urlParam.split('/').pop() || 'downloaded_file'
      
      const url = await processMedia(buffer, fileName, mimeType, fileSize, baseUrl)
      resultUrls.push(url)
    } else {
      const formData = await req.formData()
      const files = formData.getAll('media') as File[]
      
      if (!files || files.length === 0) {
        return NextResponse.json({ ...authorMeta, success: false, error: 'No files provided' }, { status: 400 })
      }
      
      if (files.length > 5) {
        return NextResponse.json({ ...authorMeta, success: false, error: 'Maximum 5 files allowed' }, { status: 400 })
      }

      for (const file of files) {
        const buffer = Buffer.from(await file.arrayBuffer())
        const url = await processMedia(buffer, file.name, file.type, file.size, baseUrl)
        resultUrls.push(url)
      }
    }

    return NextResponse.json({ ...authorMeta, success: true, message: 'Upload distributed successfully', urls: resultUrls })
  } catch (error) {
    return NextResponse.json({ ...authorMeta, success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  return POST(req)
}
