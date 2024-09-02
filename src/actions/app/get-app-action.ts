'use server'

import { actionClient, ActionError } from '@/actions/safe-action'
import { getAppInputSchema } from '@/actions/schemas/input/app/get-app-input'
import { prisma } from '@/lib/prisma'

export const getAppAction = actionClient
  .schema(getAppInputSchema)
  .action(async ({ parsedInput }) => {
    const { appSlug, teamSlug } = parsedInput

    const app = await prisma.app.findFirst({
      where: {
        slug: appSlug,
        team: {
          slug: teamSlug,
        },
      },
      select: {
        id: true,
      },
    })

    if (!app) {
      throw new ActionError('App não encontrado.')
    }

    return app.id
  })
