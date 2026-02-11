import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const rateLimitMap = new Map()

export function middleware(request: NextRequest) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  const windowMs = 1000
  const maxRequests = 10

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, startTime: now })
  } else {
    const rateData = rateLimitMap.get(ip)
    if (now - rateData.startTime < windowMs) {
      rateData.count++
      if (rateData.count > maxRequests) {
        return new NextResponse(JSON.stringify({ error: 'Too Many Requests', blocked: true }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    } else {
      rateLimitMap.set(ip, { count: 1, startTime: now })
    }
  }

  const { pathname } = request.nextUrl

  if (pathname === '/') {
    const country = request.geo?.country || 'US'
    if (country === 'ID') {
      return NextResponse.redirect(new URL('/id/~', request.url))
    } else {
      return NextResponse.redirect(new URL('/en/~', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/api/:path*']
}
