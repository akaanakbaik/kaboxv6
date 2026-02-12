export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getDatabaseStats, processTelegramMedia } from '@/lib/bot-service'

const TOKEN = process.env.TELEGRAM_BOT_TOKEN

async function sendMessage(chatId: number, text: string, parseMode = 'Markdown') {
  if (!TOKEN) return
  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: parseMode })
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    if (!body.message) return NextResponse.json({ ok: true })

    const chatId = body.message.chat.id
    const text = body.message.text
    const domain = req.headers.get('host') || 'domku.xyz'

    if (text === '/start') {
      await sendMessage(chatId, 
        `👋 *Welcome to Domku Box Bot*\n\n` +
        `Kirim foto/file apa saja, saya akan upload ke CDN Multi-Cloud.\n\n` +
        `Ketik /stats untuk cek kapasitas database.`
      )
    } 
    else if (text === '/stats') {
      const stats = await getDatabaseStats()
      await sendMessage(chatId, stats)
    }
    else if (body.message.photo || body.message.document) {
      await sendMessage(chatId, '⏳ *Sedang mengupload ke CDN...*', 'Markdown')
      
      let fileId = ''
      if (body.message.photo) {
        fileId = body.message.photo[body.message.photo.length - 1].file_id
      } else {
        fileId = body.message.document.file_id
      }

      const url = await processTelegramMedia(fileId, TOKEN as string, domain)

      if (url) {
        await sendMessage(chatId, `✅ *Upload Sukses!*\n\n🔗 URL File:\n\`${url}\``)
      } else {
        await sendMessage(chatId, '❌ Upload Gagal. Terjadi kesalahan sistem.')
      }
    }
    else {
      if (text) await sendMessage(chatId, 'Saya hanya menerima File/Foto atau command /stats')
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Telegram Webhook Error:', e)
    return NextResponse.json({ ok: false })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Telegram Webhook Ready' })
}
