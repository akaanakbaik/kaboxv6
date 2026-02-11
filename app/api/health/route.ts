export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    author: "aka",
    email: "akaanakbaik17@proton.me",
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  })
}
