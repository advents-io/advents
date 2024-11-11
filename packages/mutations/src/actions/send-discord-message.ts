'use server'

import ky from 'ky'
import { z } from 'zod'

import { authActionClient } from '../safe-action'

const inputSchema = z.object({
  webhookUrl: z.string(),
  message: z
    .string({ message: 'Mensagem é obrigatória.' })
    .min(1, { message: 'Mensagem é obrigatória.' }),
})

export const sendDiscordMessageAction = authActionClient
  .schema(inputSchema)
  .action(async ({ parsedInput }) => {
    const { webhookUrl, message } = parsedInput

    if (!webhookUrl) {
      return
    }

    try {
      await ky.post(webhookUrl, {
        json: {
          content: message,
          flags: 1 << 2, // Disable embeds
        },
      })
    } catch {}
  })
