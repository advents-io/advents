'use server'

import { getUrlOgImage, normalizeStoreUrl } from '@advents/common'
import { prisma } from '@advents/db'
import { getAppDomains } from '@advents/queries/server'

import { ActionError } from '../../../action-errors'
import { authActionClient } from '../../../safe-action'
import { inputSchema } from './schema'

export const editAppAction = authActionClient
  .schema(inputSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { id, ...newApp } = parsedInput

    const originalApp = await prisma.app.findUnique({
      where: {
        id,
        team: {
          members: {
            some: {
              userId: user.id,
            },
          },
        },
      },
    })

    if (!originalApp) {
      throw new ActionError('App não encontrado.')
    }

    const availableDomains = await getAppDomains(id)

    if (!availableDomains.some(domain => domain.domain === newApp.defaultDomain)) {
      throw new ActionError('Domínio inválido.')
    }

    const slugChanged = newApp.slug !== originalApp.slug

    if (slugChanged) {
      const slugExists = await prisma.app.findUnique({
        where: {
          slug_teamId: {
            slug: newApp.slug,
            teamId: originalApp.teamId,
          },
        },
      })

      if (slugExists) {
        throw new ActionError('Identificador único já utilizado por outro app na sua conta.')
      }
    }

    const normalizedIosUrl = normalizeStoreUrl(newApp.iosUrl)

    if (!normalizedIosUrl) {
      throw new ActionError('Url do app iOS inválida.')
    }

    newApp.iosUrl = normalizedIosUrl

    const normalizedAndroidUrl = normalizeStoreUrl(newApp.androidUrl)

    if (!normalizedAndroidUrl) {
      throw new ActionError('Url do app Android inválida.')
    }

    newApp.androidUrl = normalizedAndroidUrl

    const app = {
      ...originalApp,
      ...newApp,
    }

    const imageUrl = await getUrlOgImage(newApp.androidUrl)

    if (imageUrl && imageUrl !== originalApp.imageUrl) {
      app.imageUrl = imageUrl
    }

    await prisma.app.update({
      where: {
        id,
      },
      data: {
        ...app,
        updatedBy: user.id,
      },
    })
  })
