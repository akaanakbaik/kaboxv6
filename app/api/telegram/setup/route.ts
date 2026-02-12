export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const domain = req.headers.get('host')
  const protocol = req.headers.get('x-forwarded-proto') || 'https'
  
  if (!token) return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN belum diisi di Env Vercel' })

  const webhookUrl = `${protocol}://${domain}/api/telegram`
  
  const telegramApi = `https://api.telegram.org/bot${token}/setWebhook?url=${webhookUrl}`

  try {
    const res = await fetch(telegramApi)
    const data = await res.json()
    return NextResponse.json({ 
      success: data.ok, 
      configured_webhook: webhookUrl, 
      telegram_response: data 
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message })
  }
}
