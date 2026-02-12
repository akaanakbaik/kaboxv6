export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma, supabase, turso, appwriteDb } from '@/lib/db'
import { Query } from 'node-appwrite'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const rawId = params.id
  const id = rawId.split('.')[0]
  
  console.log(`[CDN Read] Searching for ID: ${id}`)

  try {
    // 1. Cek Prisma (Neon/Postgres)
    try {
      const mediaPrisma = await prisma.media.findUnique({ where: { id } })
      if (mediaPrisma?.url) {
        console.log('[CDN Read] Found in Prisma')
        return NextResponse.redirect(mediaPrisma.url)
      }
    } catch (e) { console.error('[CDN Read] Prisma Error:', e) }

    // 2. Cek Supabase
    try {
      const { data: mediaSupabase } = await supabase.from('Media').select('url').eq('id', id).single()
      if (mediaSupabase?.url) {
        console.log('[CDN Read] Found in Supabase')
        return NextResponse.redirect(mediaSupabase.url)
      }
    } catch (e) { console.error('[CDN Read] Supabase Error:', e) }

    // 3. Cek Turso
    try {
      const tursoResult = await turso.execute({
        sql: 'SELECT url FROM Media WHERE id = ?',
        args: [id]
      })
      if (tursoResult.rows[0]?.url) {
        console.log('[CDN Read] Found in Turso')
        return NextResponse.redirect(tursoResult.rows[0].url as string)
      }
    } catch (e) { console.error('[CDN Read] Turso Error:', e) }

    // 4. Cek Appwrite Database (YANG DITAMBAHKAN)
    try {
      const appwriteResult = await appwriteDb.listDocuments(
        process.env.APPWRITE_DATABASE_ID as string,
        'media_collection',
        [Query.equal('id', id)]
      )
      if (appwriteResult.documents.length > 0) {
        const doc = appwriteResult.documents[0] as any
        if (doc.url) {
          console.log('[CDN Read] Found in Appwrite')
          return NextResponse.redirect(doc.url)
        }
      }
    } catch (e) { console.error('[CDN Read] Appwrite Error:', e) }

    return new NextResponse(JSON.stringify({
      error: 'Media Not Found in CDN Network',
      id_searched: id,
      message: 'Data not found in Prisma, Supabase, Turso, or Appwrite. Check your DB connections.'
    }), { status: 404, headers: { 'Content-Type': 'application/json' } })

  } catch (error) {
    console.error('[CDN Read] Critical Error:', error)
    return new NextResponse('CDN Edge Gateway Critical Error', { status: 500 })
  }
}
