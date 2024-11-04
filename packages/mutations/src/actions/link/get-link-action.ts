'use server'

import { prisma } from '@advents/db'

import { ActionError } from '../../action-errors'
import { authActionClient } from '../../safe-action'
import { getLinkInputSchema } from '../../schemas/input/link/get-link-input'
import { getLinkOutputSchema } from '../../schemas/output/link/get-link-output'

export const getLinkAction = authActionClient
  .schema(getLinkInputSchema)
  .outputSchema(getLinkOutputSchema)
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
    })

    if (!link) {
      throw new ActionError('Link não encontrado')
    }

    return link
  })
