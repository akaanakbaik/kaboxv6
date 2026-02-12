import TelegramBot from 'node-telegram-bot-api'

const token = process.env.TELEGRAM_BOT_TOKEN
if (!token) throw new Error('TELEGRAM_BOT_TOKEN is not defined')

export const bot = new TelegramBot(token, { polling: false })

export const OWNER_ID = process.env.TELEGRAM_OWNER_ID
export const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID

export async function logToChannel(title: string, message: string) {
  if (!CHANNEL_ID) return
  const text = `<b>🔔 KABOX MONITOR</b>\n\n<b>📌 ${title}</b>\n${message}\n\n<i>📅 ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}</i>`
  try {
    await bot.sendMessage(CHANNEL_ID, text, { parse_mode: 'HTML' })
  } catch (e) {
    console.error('Failed to log to channel', e)
  }
}
