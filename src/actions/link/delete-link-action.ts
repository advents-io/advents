'use server'

import { actionClient } from '@/actions/safe-action'
import { deleteLinkInputSchema } from '@/actions/schemas/input/link/delete-link-input'
import { prisma } from '@/lib/prisma'

export const deleteLinkAction = actionClient
  .schema(deleteLinkInputSchema)
  .action(async ({ parsedInput }) => {
    const { linkId } = parsedInput

    await prisma.link.delete({
      where: {
        id: linkId,
      },
    })
  })
