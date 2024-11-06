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

const outputSchema = z.object({
  id: z.string().uuid(),
  title: z.string().nullable(),
  domain: z.string(),
  slug: z.string(),
  androidUrl: z.string().url(),
  iosUrl: z.string().url(),
  fallbackUrl: z.string().url(),
  campaignCost: z.number().nullable(),
})

export type GetLinkOutputProps = z.infer<typeof outputSchema>

export const getLinkAction = authActionClient
  .schema(inputSchema)
  .outputSchema(outputSchema)
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
