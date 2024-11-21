'use server'

import { DISCORD_WEBHOOKS, SUPPORT_PHONE, whatsapp } from '@advents/common'
import { prisma } from '@advents/db'
import { z } from 'zod'

import { ActionError } from '../../action-errors'
import { authActionClient } from '../../safe-action'
import { sendDiscordMessageAction } from '../send-discord-message'

const inputSchema = z.object({
  appSlug: z.string({ message: 'Slug do app inválido.' }),
  domain: z
    .string({ message: 'Domínio inválido.' })
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9-_.]+\.[a-zA-Z]{2,}$/, 'Formato de domínio inválido.'),
})

export const deleteCustomDomainAction = authActionClient
  .schema(inputSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { appSlug, domain } = parsedInput

    const app = await prisma.app.findFirst({
      where: {
        slug: appSlug,
        team: {
          members: {
            some: {
              userId: user.id,
            },
          },
        },
      },
      select: {
        name: true,
        slug: true,
      },
    })

    if (!app) {
      throw new ActionError('App não encontrado.')
    }

    const whatsAppMessage = [
      'Olá, gostaria de *remover* um domínio do meu app na Advents. 🗑️',
      '',
      `Domínio: *${domain}*`,
      `App: *${app.name}* | *${app.slug}*`,
      `E-mail: ${user.email}`,
    ].join('\n')

    const discordMessage = [
      '🗑️ **Nova solicitação de REMOÇÃO de domínio**',
      '',
      `> App: **${app.name}** | \`${app.slug}\``,
      `> Domínio: \`${domain}\``,
      `> Usuário: \`${user.email}\``,
    ].join('\n')

    await sendDiscordMessageAction({
      message: discordMessage,
      webhookUrl: DISCORD_WEBHOOKS.ADD_DOMAIN_REQUEST,
    })

    return {
      whatsappUrl: whatsapp.buildMessageUrl(SUPPORT_PHONE, whatsAppMessage),
    }
  })
