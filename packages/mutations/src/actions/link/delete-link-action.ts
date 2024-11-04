'use server'

import { prisma } from '@advents/db'

import { ActionError } from '../../action-errors'
import { authActionClient } from '../../safe-action'
import { deleteLinkInputSchema } from '../../schemas/input/link/delete-link-input'

export const deleteLinkAction = authActionClient
  .schema(deleteLinkInputSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { linkId } = parsedInput

    const link = await prisma.link.findUnique({
      where: {
        id: linkId,
        app: {
          team: {
            members: {
              some: {
                userId: user.id,
              },
            },
          },
        },
      },
      select: {
        id: true,
      },
    })

    if (!link) {
      throw new ActionError('Link não encontrado.')
    }

    await prisma.link.delete({
      where: {
        id: link.id,
      },
    })
  })
