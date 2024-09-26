'use server'

import { prisma } from '@advents/db'

import { authActionClient } from '@/actions/safe-action'
import { deleteLinkInputSchema } from '@/actions/schemas/input/link/delete-link-input'

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
