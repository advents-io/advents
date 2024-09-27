'use server'

import { prisma } from '@advents/db'

import { authActionClient } from '../../safe-action'
import { deleteLinkInputSchema } from '../../schemas/input/link/delete-link-input'

export const deleteLinkAction = authActionClient
  .schema(deleteLinkInputSchema)
  .action(async ({ parsedInput }) => {
    const { linkId } = parsedInput

    await prisma.link.delete({
      where: {
        id: linkId,
      },
    })
  })
