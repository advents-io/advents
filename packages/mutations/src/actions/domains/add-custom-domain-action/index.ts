'use server'

import { discord, SUPPORT_PHONE, whatsapp } from '@advents/common'
import { prisma } from '@advents/db'

import { ActionError } from '../../../action-errors'
import { authActionClient } from '../../../safe-action'
import { inputSchema } from './schema'

export const addCustomDomainAction = authActionClient
  .schema(inputSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { appSlug, domain } = parsedInput

    // TODO: user can be on multiple teams and app slug can repeat
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
      'Olá, gostaria de *adicionar* um domínio na Advents.',
      '',
      `Domínio: *${domain}*`,
      `App: *${app.name}* | *${app.slug}*`,
      `E-mail: ${user.email}`,
    ].join('\n')

    const discordMessage = [
      '🌐 **Nova solicitação de ADIÇÃO de domínio**',
      '',
      `> App: **${app.name}** | \`${app.slug}\``,
      `> Domínio: \`${domain}\``,
      `> Usuário: \`${user.email}\``,
    ].join('\n')

    await discord.sendMessage({
      channel: 'DOMAINS',
      message: discordMessage,
    })

    return {
      whatsappUrl: whatsapp.buildMessageUrl(SUPPORT_PHONE, whatsAppMessage),
    }
  })
