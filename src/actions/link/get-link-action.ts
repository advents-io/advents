'use server'

import { actionClient, ActionError } from '@/actions/safe-action'
import { getLinkInputSchema } from '@/actions/schemas/input/get-link-input'
import { getLinkOutputSchema } from '@/actions/schemas/output/get-link-output'
import { prisma } from '@/lib/prisma'

export const getLinkAction = actionClient
  .schema(getLinkInputSchema)
  .action(async ({ parsedInput }) => {
    const { linkId } = parsedInput

    const link = await prisma.link.findUnique({
      where: {
        id: linkId,
      },
    })

    if (!link) {
      throw new ActionError('Link não encontrado')
    }

    return getLinkOutputSchema.parse(link)
  })
