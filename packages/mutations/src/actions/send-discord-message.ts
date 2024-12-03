'use server'

import { discord } from '@advents/common'
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
    await discord.sendMessage(parsedInput)
  })
