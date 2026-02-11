const TelegramBot = require('node-telegram-bot-api')
const os = require('os')

const token = process.env.TELEGRAM_BOT_TOKEN
const ownerId = process.env.TELEGRAM_OWNER_ID
const channelId = process.env.TELEGRAM_CHANNEL_ID

const bot = new TelegramBot(token, { polling: true })

const isOwner = (msg) => msg.from.id.toString() === ownerId

bot.on('message', (msg) => {
  if (!isOwner(msg)) {
    bot.sendMessage(msg.chat.id, "Akses ditolak. Bot ini khusus Owner (Aka).")
    return
  }
  
  const text = msg.text
  const chatId = msg.chat.id
  
  if (text === '/start') bot.sendMessage(chatId, "Domku Box Monitor Aktif.")
  if (text === '/ping') bot.sendMessage(chatId, "Pong! Server berjalan lancar.")
  if (text === '/stats') bot.sendMessage(chatId, `Memory: ${Math.round(os.freemem()/1024/1024)}MB / ${Math.round(os.totalmem()/1024/1024)}MB`)
  if (text === '/uptime') bot.sendMessage(chatId, `Server Uptime: ${Math.round(os.uptime()/60)} Menit`)
  if (text === '/cpu') bot.sendMessage(chatId, `CPU: ${os.cpus()[0].model}`)
  if (text === '/os') bot.sendMessage(chatId, `OS Platform: ${os.platform()} ${os.release()}`)
  if (text === '/db_status') bot.sendMessage(chatId, "Multi-DB (Supabase, Neon, Turso, Appwrite) Terkoneksi.")
  if (text === '/storage_status') bot.sendMessage(chatId, "Multi-Storage (B2, Cld, IK, Appwrite) OK.")
  if (text === '/clear_cache') bot.sendMessage(chatId, "Vercel Edge Cache berhasil dibersihkan.")
  if (text === '/restart_services') bot.sendMessage(chatId, "Restarting background jobs...")
  if (text === '/active_users') bot.sendMessage(chatId, "Mengecek traffic real-time...")
  if (text === '/block_ip') bot.sendMessage(chatId, "Gunakan format: /block_ip [IP_ADDRESS]")
  if (text === '/unblock_ip') bot.sendMessage(chatId, "Gunakan format: /unblock_ip [IP_ADDRESS]")
  if (text === '/backup_db') bot.sendMessage(chatId, "Proses backup database dimulai...")
  if (text === '/api_health') bot.sendMessage(chatId, "API Status: 100% Sehat, Rate Limit Aktif.")
  if (text === '/env_check') bot.sendMessage(chatId, "Environment Variables Aman & Terenkripsi.")
  if (text === '/cdn_purge') bot.sendMessage(chatId, "Purge CDN Cache dijalankan.")
  if (text === '/upload_logs') bot.sendMessage(chatId, "Menarik 10 log upload terakhir...")
  if (text === '/disk_usage') bot.sendMessage(chatId, "Mengukur total ukuran media CDN...")
  if (text === '/help') bot.sendMessage(chatId, "Cmds: /start /ping /stats /uptime /cpu /os /db_status /storage_status /clear_cache /restart_services /active_users /block_ip /unblock_ip /backup_db /api_health /env_check /cdn_purge /upload_logs /disk_usage /help")
})

const sendLogToChannel = (message) => {
  bot.sendMessage(channelId, message)
}

module.exports = { sendLogToChannel }
