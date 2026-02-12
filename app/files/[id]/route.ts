export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma, supabase, turso, appwriteDb } from '@/lib/db'
import { Query } from 'node-appwrite'

async function proxyFile(targetUrl: string) {
  try {
    const response = await fetch(targetUrl)
    
    if (!response.ok) {
      return new NextResponse('Failed to fetch file from storage', { status: 502 })
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    const headers = new Headers()
    
    headers.set('Content-Type', contentType)
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    headers.set('Access-Control-Allow-Origin', '*')

    return new NextResponse(response.body, {
      status: 200,
      headers
    })
  } catch (error) {
    console.error('[Proxy Error]', error)
    return new NextResponse('Internal Proxy Error', { status: 500 })
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const rawId = params.id
  const id = rawId.split('.')[0]
  
  try {
    // 1. Cek Prisma
    try {
      const mediaPrisma = await prisma.media.findUnique({ where: { id } })
      if (mediaPrisma?.url) return proxyFile(mediaPrisma.url)
    } catch (e) {}

    // 2. Cek Supabase
    try {
      const { data: mediaSupabase } = await supabase.from('Media').select('url').eq('id', id).single()
      if (mediaSupabase?.url) return proxyFile(mediaSupabase.url)
    } catch (e) {}

    // 3. Cek Turso
    try {
      const tursoResult = await turso.execute({
        sql: 'SELECT url FROM Media WHERE id = ?',
        args: [id]
      })
      if (tursoResult.rows[0]?.url) return proxyFile(tursoResult.rows[0].url as string)
    } catch (e) {}

    // 4. Cek Appwrite
    try {
      const appwriteResult = await appwriteDb.listDocuments(
        process.env.APPWRITE_DATABASE_ID as string,
        'media_collection',
        [Query.equal('id', id)]
      )
      if (appwriteResult.documents.length > 0) {
        const doc = appwriteResult.documents[0] as any
        if (doc.url) return proxyFile(doc.url)
      }
    } catch (e) {}

    return new NextResponse(JSON.stringify({
      error: 'Media Not Found',
      message: 'The requested file does not exist in our database.'
    }), { status: 404, headers: { 'Content-Type': 'application/json' } })

  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
