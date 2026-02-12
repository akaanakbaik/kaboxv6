import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID

async function sendLog(text: string) {
  if (!BOT_TOKEN || !CHANNEL_ID) return
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHANNEL_ID,
        text: text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        disable_notification: true 
      })
    })
  } catch (e) {}
}

export function middleware(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'Unknown IP'
  const path = req.nextUrl.pathname
  const method = req.method
  const ua = req.headers.get('user-agent') || 'Unknown UA'
  const country = req.geo?.country || 'Unknown'

  // Filter: Jangan log file statis agar tidak spam
  if (!path.match(/\.(ico|png|jpg|jpeg|svg|css|js|map|json)$/) && !path.startsWith('/_next') && !path.startsWith('/api/telegram')) {
    const text = `<b>🔔 TRAFFIC INCOMING</b>\n\n` +
                 `🛣 <b>Path:</b> <code>${method} ${path}</code>\n` +
                 `🌍 <b>IP:</b> <code>${ip}</code> (${country})\n` +
                 `📱 <b>Device:</b> <code>${ua}</code>`
    
    // Fire and forget log
    sendLog(text).catch(console.error)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}
