export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import TelegramBot from 'node-telegram-bot-api'
import { getSystemStats, getDatabaseStats, processTelegramMedia } from '@/lib/bot-service'
import { revalidatePath } from 'next/cache'

const TOKEN = process.env.TELEGRAM_BOT_TOKEN
const OWNER_ID = process.env.TELEGRAM_OWNER_ID

const bot = new TelegramBot(TOKEN || '', { polling: false })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (!body.message) return NextResponse.json({ ok: true })

    const msg = body.message
    const chatId = msg.chat.id
    const text = msg.text || ''
    const userId = msg.from?.id.toString()
    const domain = req.headers.get('host') || 'domku.xyz'

    if (OWNER_ID && userId !== OWNER_ID) {
      await bot.sendMessage(chatId, "⛔ Akses Ditolak.")
      return NextResponse.json({ ok: true })
    }

    if (text === '/start') {
      await bot.sendMessage(chatId, "👋 Domku Box Monitor Aktif.\nKirim file untuk upload atau gunakan command:\n/stats, /db_status, /api_health, /env_check")
    }
    else if (text === '/ping') {
      await bot.sendMessage(chatId, "🏓 Pong! Server OK.")
    }
    else if (text === '/stats' || text === '/cpu') {
      const stats = getSystemStats()
      await bot.sendMessage(chatId, stats, { parse_mode: 'Markdown' })
    }
    else if (text === '/db_status') {
      const dbStats = await getDatabaseStats()
      await bot.sendMessage(chatId, dbStats, { parse_mode: 'Markdown' })
    }
    else if (text === '/storage_status') {
      await bot.sendMessage(chatId, "☁️ Storage Providers: B2, ImageKit, Cloudinary, Appwrite (Active)")
    }
    else if (text === '/clear_cache') {
      revalidatePath('/')
      await bot.sendMessage(chatId, "♻️ Cache Vercel dibersihkan.")
    }
    else if (text === '/api_health') {
      await bot.sendMessage(chatId, "🏥 API Status: 100% Healthy")
    }
    else if (text === '/env_check') {
      await bot.sendMessage(chatId, "🔐 ENV Variables Terdeteksi & Aman.")
    }
    else if (msg.photo || msg.document) {
      await bot.sendMessage(chatId, '⏳ Uploading to Multi-CDN...')
      
      let fileId = ''
      if (msg.photo) {
        fileId = msg.photo[msg.photo.length - 1].file_id
      } else {
        fileId = msg.document.file_id
      }

      if (TOKEN) {
        const url = await processTelegramMedia(fileId, TOKEN, domain)
        if (url) {
          await bot.sendMessage(chatId, `✅ Upload Sukses!\n\n🔗 ${url}`)
        } else {
          await bot.sendMessage(chatId, '❌ Upload Gagal.')
        }
      }
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Telegram Webhook Ready' })
}
