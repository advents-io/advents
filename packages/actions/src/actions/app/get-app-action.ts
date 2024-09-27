'use server'

import { prisma } from '@advents/db'

import { ActionError } from '../../action-errors'
import { authActionClient } from '../../safe-action'
import { getAppInputSchema } from '../../schemas/input/app/get-app-input'
import {
  getAppDefaultValuesOutputSchema,
  getAppOutputSchema,
} from '../../schemas/output/app/get-app-output'

export const getAppAction = authActionClient
  .schema(getAppInputSchema)
  .outputSchema(getAppOutputSchema)
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

export const getAppIdAction = authActionClient
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

    return { id: app.id }
  })

export const getAppDefaultValuesAction = authActionClient
  .schema(getAppInputSchema)
  .outputSchema(getAppDefaultValuesOutputSchema)
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
        defaultDomain: true,
        androidUrl: true,
        iosUrl: true,
        defaultFallbackUrl: true,
      },
    })

    if (!app) {
      throw new ActionError('App não encontrado.')
    }

    return app
  })
