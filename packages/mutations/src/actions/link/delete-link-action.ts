'use server'

import { prisma } from '@advents/db'
import { z } from 'zod'

import { ActionError } from '../../action-errors'
import { authActionClient } from '../../safe-action'

const inputSchema = z.object({
  linkId: z
    .string({ message: 'Id do link em formato inválido.' })
    .uuid('Id do link em formato inválido.'),
})

export const deleteLinkAction = authActionClient
  .schema(inputSchema)
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
