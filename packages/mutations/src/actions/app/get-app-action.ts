'use server'

import { prisma } from '@advents/db'
import { z } from 'zod'

import { ActionError } from '../../action-errors'
import { authActionClient } from '../../safe-action'

const inputSchema = z.object({
  teamSlug: z.string({ message: 'Slug da equipe é obrigatório.' }),
  appSlug: z.string({ message: 'Slug do app é obrigatório.' }),
})

const outputSchema = z.object({
  name: z.string(),
  slug: z.string(),
  defaultDomain: z.string(),
  androidUrl: z.string().url(),
  iosUrl: z.string().url(),
  defaultFallbackUrl: z.string().url().nullable(),
  imageUrl: z.string().url(),
  qrcodeLogoUrl: z.string().url().nullable(),
})

export type GetAppOutputProps = z.infer<typeof outputSchema>

export const getAppAction = authActionClient
  .schema(inputSchema)
  .outputSchema(outputSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { appSlug, teamSlug } = parsedInput

    const app = await prisma.app.findFirst({
      where: {
        slug: appSlug,
        team: {
          slug: teamSlug,
          members: {
            some: {
              userId: user.id,
            },
          },
        },
      },
      select: {
        name: true,
        slug: true,
        defaultDomain: true,
        imageUrl: true,
        androidUrl: true,
        iosUrl: true,
        defaultFallbackUrl: true,
        qrcodeLogoUrl: true,
      },
    })

    if (!app) {
      throw new ActionError('App não encontrado.')
    }

    return app
  })
