import ky from 'ky'
import { z } from 'zod'

const WEBHOOKS = {
  FEEDBACKS:
    'https://discord.com/api/webhooks/1305608429649395742/t8fcJLxvTxciExz65A_W7APpp_9qTR7jliBG6NhWi1SsGQ-5EcrGsDPDVa18yPji23EG',
  DOMAINS:
    'https://discord.com/api/webhooks/1309241595559809054/7LpkjjHru3Sk195XoXHcRsUg6BzWgo1NKVu6yo0DNM5r3j5oFCUEP_hJHmfmgI2-UEs9',
  ERRORS:
    'https://discord.com/api/webhooks/1313322427098464308/y_aA4mjh0GRz1RJKPOLlqYPheAXG3H0tLaP9qh-j4O34aqEERKedfyR9QEZoEkFs5-Vz',
}

type DiscordChannel = keyof typeof WEBHOOKS

export const discordChannelSchema = z.enum(Object.keys(WEBHOOKS) as [DiscordChannel])

type SendMessageProps = {
  channel: DiscordChannel
  message: string
}

const sendMessage = async ({ channel, message }: SendMessageProps) => {
  try {
    const webhook = WEBHOOKS[channel]

    await ky.post(webhook, {
      json: {
        content: message,
        flags: 1 << 2, // Disable embeds
      },
    })
  } catch {}
}

type SendErrorProps = {
  description: string
  error: unknown
}

const sendErrorLog = async ({ description, error }: SendErrorProps) => {
  try {
    const message = [
      '🚨 **Ocorreu um erro**',
      '',
      description,
      '',
      '```',
      JSON.stringify(error),
      '```',
    ].join('\n')

    await sendMessage({
      channel: 'ERRORS',
      message,
    })
  } catch {}
}

export const discord = {
  sendMessage,
  sendErrorLog,
}
