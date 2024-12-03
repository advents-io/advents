'use server'

import { discord, discordChannelSchema } from '@advents/common'
import { z } from 'zod'

import { authActionClient } from '../safe-action'

const inputSchema = z.object({
  channel: discordChannelSchema,
  message: z
    .string({ message: 'Mensagem é obrigatória.' })
    .min(1, { message: 'Mensagem é obrigatória.' }),
})

export const sendDiscordMessageAction = authActionClient
  .schema(inputSchema)
  .action(async ({ parsedInput }) => {
    await discord.sendMessage(parsedInput)
  })
