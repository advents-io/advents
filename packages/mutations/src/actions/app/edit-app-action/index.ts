'use server'

import { getUrlOgImage, routes } from '@advents/common'
import { prisma } from '@advents/db'
import { getLinkDomains } from '@advents/queries/server'
import { redirect } from 'next/navigation'

import { ActionError } from '../../../action-errors'
import { authActionClient } from '../../../safe-action'
import { editAppInputSchema } from './schema'

export const editAppAction = authActionClient
  .schema(editAppInputSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { id, ...newApp } = parsedInput

    const originalAppResult = await prisma.app.findUnique({
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
      include: {
        team: {
          select: {
            slug: true,
          },
        },
      },
    })

    if (!originalAppResult) {
      throw new ActionError('App não encontrado.')
    }

    const availableDomains = await getLinkDomains(id)

    if (!availableDomains.includes(newApp.defaultDomain)) {
      throw new ActionError('Domínio inválido.')
    }

    const { team, ...originalApp } = originalAppResult

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

    redirect(routes.SETTINGS.path(team.slug, app.slug))
  })
