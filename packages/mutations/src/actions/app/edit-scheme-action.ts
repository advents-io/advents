'use server'

import { prisma } from '@advents/db'
import { z } from 'zod'

import { ActionError } from '../../action-errors'
import { authActionClient } from '../../safe-action'

const inputSchema = z.object({
  appId: z.string(),
  scheme: z.string().nullable(),
})

export const editSchemeAction = authActionClient
  .schema(inputSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { appId, scheme } = parsedInput

    const app = await prisma.app.findUnique({
      where: {
        id: appId,
        team: {
          members: {
            some: {
              userId: user.id,
            },
          },
        },
      },
    })

    if (!app) {
      throw new ActionError('App não encontrado.')
    }

    await prisma.app.update({
      where: {
        id: appId,
      },
      data: {
        scheme,
        updatedBy: user.id,
      },
    })
  })
