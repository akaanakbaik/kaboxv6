export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma, turso, supabase, appwriteDb } from '@/lib/db'

export async function GET() {
  const startTime = Date.now()
  const checks = {
    prisma: { status: 'unknown', latency: 0, message: '' },
    supabase: { status: 'unknown', latency: 0, message: '' },
    turso: { status: 'unknown', latency: 0, message: '' },
    appwrite: { status: 'unknown', latency: 0, message: '' }
  }

  try {
    const pStart = Date.now()
    await prisma.$queryRaw`SELECT 1`
    checks.prisma = { status: 'healthy', latency: Date.now() - pStart, message: 'Connected' }
  } catch (e: any) {
    checks.prisma = { status: 'down', latency: 0, message: e.message }
  }

  try {
    const sStart = Date.now()
    const { error } = await supabase.from('Media').select('id').limit(1)
    if (!error) {
      checks.supabase = { status: 'healthy', latency: Date.now() - sStart, message: 'Connected' }
    } else {
      throw error
    }
  } catch (e: any) {
    checks.supabase = { status: 'down', latency: 0, message: e.message || 'Connection failed' }
  }

  try {
    const tStart = Date.now()
    await turso.execute('SELECT 1')
    checks.turso = { status: 'healthy', latency: Date.now() - tStart, message: 'Connected' }
  } catch (e: any) {
    checks.turso = { status: 'down', latency: 0, message: e.message }
  }

  try {
    const aStart = Date.now()
    await appwriteDb.listDocuments(
      process.env.APPWRITE_DATABASE_ID as string,
      'media_collection',
      []
    )
    checks.appwrite = { status: 'healthy', latency: Date.now() - aStart, message: 'Connected' }
  } catch (e: any) {
    checks.appwrite = { status: 'down', latency: 0, message: e.message }
  }

  const totalServices = 4
  const activeServices = Object.values(checks).filter(c => c.status === 'healthy').length
  
  let systemStatus = 'healthy'
  if (activeServices === 0) systemStatus = 'critical_down'
  else if (activeServices < totalServices) systemStatus = 'degraded_performance'

  return NextResponse.json({
    system_status: systemStatus,
    active_nodes: `${activeServices}/${totalServices}`,
    timestamp: new Date().toISOString(),
    uptime_seconds: process.uptime(),
    total_check_latency_ms: Date.now() - startTime,
    details: checks
  }, { status: 200 })
}
