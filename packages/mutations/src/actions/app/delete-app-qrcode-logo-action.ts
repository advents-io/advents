'use server'

import { prisma } from '@advents/db'
import { z } from 'zod'

import { ActionError } from '../../action-errors'
import { authActionClient } from '../../safe-action'

const inputSchema = z.object({
  appSlug: z.string({ message: 'Slug do app inválido.' }),
})

export const deleteAppQrCodeLogoAction = authActionClient
  .schema(inputSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { appSlug } = parsedInput

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
        id: true,
      },
    })

    if (!app) {
      throw new ActionError('App não encontrado.')
    }

    await prisma.app.update({
      where: {
        id: app.id,
      },
      data: {
        qrCodeLogoUrl: null,
        updatedBy: user.id,
      },
    })
  })
