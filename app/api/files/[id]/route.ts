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

    const domain = req.headers.get('host') || 'domku.xyz'
    const protocol = req.headers.get('x-forwarded-proto') || 'https'
    const baseUrl = `${protocol}://${domain}`

    return NextResponse.json({
      ...authorMeta,
      success: true,
      data: {
        id: media.id,
        name: media.name,
        size: media.size,
        mimeType: media.mimeType,
        chunked: false,
        chunkCount: 0,
        checksum: "sha256...", 
        createdAt: media.createdAt,
        downloadUrl: `${baseUrl}/api/files/${media.id}/download`
      }
    })

  } catch (error) {
    return NextResponse.json({ ...authorMeta, success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
