import { NextRequest, NextResponse } from 'next/server'
import { prisma, supabase, turso } from '@/lib/db'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const rawId = params.id
    const id = rawId.split('.')[0]

    const mediaFromPrisma = await prisma.media.findUnique({ where: { id } }).catch(() => null)
    
    const { data: mediaFromSupabase } = await supabase.from('Media').select('url').eq('id', id).single()
    
    const tursoResult = await turso.execute({
      sql: 'SELECT url FROM Media WHERE id = ?',
      args: [id]
    }).catch(() => ({ rows: [] }))

    const mediaUrl = mediaFromPrisma?.url || mediaFromSupabase?.url || tursoResult.rows[0]?.url

    if (!mediaUrl) {
      return new NextResponse('Media Not Found in CDN Network', { status: 404 })
    }

    return NextResponse.redirect(mediaUrl as string)
  } catch (error) {
    return new NextResponse('CDN Edge Gateway Error', { status: 500 })
  }
}
