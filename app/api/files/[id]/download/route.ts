import { NextRequest, NextResponse } from 'next/server'
import { prisma, supabase } from '@/lib/db'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const authorMeta = {
    author: "aka",
    email: "akaanakbaik17@proton.me"
  }

  try {
    const { id } = params

    const mediaFromPrisma = await prisma.media.findUnique({ where: { id } }).catch(() => null)
    const { data: mediaFromSupabase } = await supabase.from('Media').select('*').eq('id', id).single()

    const media = mediaFromPrisma || mediaFromSupabase

    if (!media) {
      return NextResponse.json({ ...authorMeta, success: false, error: 'File not found' }, { status: 404 })
    }

    const fileResponse = await fetch(media.url)
    
    if (!fileResponse.ok) {
       return NextResponse.json({ ...authorMeta, success: false, error: 'Failed to fetch file from storage' }, { status: 500 })
    }

    const headers = new Headers(fileResponse.headers)
    headers.set('Content-Disposition', `attachment; filename="${media.name}"`)
    headers.set('Content-Type', media.mimeType)

    return new NextResponse(fileResponse.body, {
      status: 200,
      headers
    })

  } catch (error) {
    return NextResponse.json({ ...authorMeta, success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
