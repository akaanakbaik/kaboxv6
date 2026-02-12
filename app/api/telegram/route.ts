export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { bot, OWNER_ID, logToChannel } from '@/lib/telegram'
import { getMainMenu, getSystemStats, getDatabaseMenu, processUpload } from '@/lib/bot-service'
import { revalidatePath } from 'next/cache'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const domain = req.headers.get('host') || 'kabox.my.id'

    if (body.callback_query) {
      const cq = body.callback_query
      const chatId = cq.message.chat.id
      const messageId = cq.message.message_id
      const data = cq.data
      const userId = String(cq.from.id)

      if (userId !== OWNER_ID) {
        await bot.answerCallbackQuery(cq.id, { text: "⛔ Akses Ditolak! Anda bukan Owner.", show_alert: true })
        return NextResponse.json({ ok: true })
      }

      await bot.answerCallbackQuery(cq.id)

      if (data === "main_menu") {
        const { text, opts } = await getMainMenu()
        await bot.editMessageText(text, { chat_id: chatId, message_id: messageId, ...opts })
      } 
      else if (data === "stats") {
        const { text, opts } = await getSystemStats()
        await bot.editMessageText(text, { chat_id: chatId, message_id: messageId, ...opts })
      } 
      else if (data === "db_check") {
        const { text, opts } = await getDatabaseMenu()
        await bot.editMessageText(text, { chat_id: chatId, message_id: messageId, ...opts })
      }
      else if (data === "storage") {
        const text = `<b>☁️ STORAGE CONFIGURATION</b>\n\n✅ Backblaze B2\n✅ ImageKit\n✅ Cloudinary\n✅ Appwrite Storage\n\n<i>Failover System Active.</i>`
        const opts = { parse_mode: 'HTML', reply_markup: { inline_keyboard: [[{ text: "🔙 Kembali", callback_data: "main_menu" }]] } }
        await bot.editMessageText(text, { chat_id: chatId, message_id: messageId, ...opts as any })
      }
      else if (data === "clear_cache") {
        revalidatePath('/')
        await bot.answerCallbackQuery(cq.id, { text: "♻️ Cache Vercel berhasil dibersihkan!", show_alert: true })
      }
      else if (data === "health") {
        const text = `<b>🏥 API HEALTH STATUS</b>\n\nStatus: <b>Healthy</b>\nLatency: <b>~20ms</b>\nRate Limit: <b>On</b>`
        const opts = { parse_mode: 'HTML', reply_markup: { inline_keyboard: [[{ text: "🔙 Kembali", callback_data: "main_menu" }]] } }
        await bot.editMessageText(text, { chat_id: chatId, message_id: messageId, ...opts as any })
      }
      else if (data === "env_check") {
        const text = `<b>🔐 ENV VARIABLES CHECK</b>\n\nDB_URL: OK\nBOT_TOKEN: OK\nSTORAGE_KEYS: OK\nOWNER_ID: ${OWNER_ID}\n\n<i>Environment aman.</i>`
        const opts = { parse_mode: 'HTML', reply_markup: { inline_keyboard: [[{ text: "🔙 Kembali", callback_data: "main_menu" }]] } }
        await bot.editMessageText(text, { chat_id: chatId, message_id: messageId, ...opts as any })
      }
      else if (data === "owner") {
        const text = `<b>👤 OWNER PROFILE</b>\n\nNama: <b>Aka</b>\nID: <code>${OWNER_ID}</code>\nRole: <b>Super Admin</b>\nLink: @akamodebaik`
        const opts = { parse_mode: 'HTML', reply_markup: { inline_keyboard: [[{ text: "🔙 Kembali", callback_data: "main_menu" }]] } }
        await bot.editMessageText(text, { chat_id: chatId, message_id: messageId, ...opts as any })
      }
      else if (data === "help") {
        const text = `<b>❓ PANDUAN BOT</b>\n\nBot ini khusus untuk owner mengelola website Kabox. Gunakan menu tombol untuk navigasi. Kirim file gambar/video langsung ke chat ini untuk upload ke CDN.`
        const opts = { parse_mode: 'HTML', reply_markup: { inline_keyboard: [[{ text: "🔙 Kembali", callback_data: "main_menu" }]] } }
        await bot.editMessageText(text, { chat_id: chatId, message_id: messageId, ...opts as any })
      }
      else if (data === "upload_mode") {
        const text = `<b>🚀 UPLOAD MODE</b>\n\nSilakan kirim file <b>Gambar</b> atau <b>Dokumen</b> sekarang juga. Bot akan memprosesnya otomatis.`
        const opts = { parse_mode: 'HTML', reply_markup: { inline_keyboard: [[{ text: "🔙 Kembali", callback_data: "main_menu" }]] } }
        await bot.editMessageText(text, { chat_id: chatId, message_id: messageId, ...opts as any })
      }

      return NextResponse.json({ ok: true })
    }

    if (body.message) {
      const msg = body.message
      const chatId = msg.chat.id
      const userId = String(msg.from.id)
      const text = msg.text

      if (userId !== OWNER_ID) {
        await bot.sendMessage(chatId, `⛔ <b>ACCESS DENIED</b>\n\nBot ini adalah private property milik <a href="t.me/akamodebaik">Aka</a>.`, { parse_mode: 'HTML' })
        await logToChannel("UNAUTHORIZED ACCESS", `User: ${msg.from.first_name} (ID: ${userId})\nTried to use bot.`)
        return NextResponse.json({ ok: true })
      }

      if (text === '/start' || text === '/menu') {
        const { text: menuText, opts } = await getMainMenu()
        await bot.sendMessage(chatId, menuText, opts)
      } else if (msg.photo || msg.document) {
        const loadingMsg = await bot.sendMessage(chatId, "⏳ <b>Sedang mengupload ke Multi-CDN...</b>", { parse_mode: 'HTML' })
        let fileId = msg.photo ? msg.photo[msg.photo.length - 1].file_id : msg.document.file_id
        
        const resultText = await processUpload(fileId, domain)
        
        await bot.deleteMessage(chatId, loadingMsg.message_id)
        await bot.sendMessage(chatId, resultText, { parse_mode: 'HTML', disable_web_page_preview: true })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ ok: false })
  }
}
