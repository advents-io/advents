'use server'

import { prisma } from '@advents/db'
import { redirect } from 'next/navigation'

import { ActionError } from '@/actions/action-errors'
import { authActionClient } from '@/actions/safe-action'
import { editAppInputSchema } from '@/actions/schemas/input/app/edit-app-input'
import { fetchUrlOgImage } from '@/helpers/og-helper'
import { routes } from '@advents/common'

export const editAppAction = authActionClient
  .schema(editAppInputSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { id, ...newApp } = parsedInput

    const originalApp = await prisma.app.findUnique({ where: { id } })

    if (!originalApp) {
      throw new ActionError('App não encontrado.')
    }

    const team = await prisma.team.findUnique({
      where: {
        id: originalApp.teamId,
      },
    })

    if (!team) {
      throw new ActionError('Conta não encontrada.')
    }

    const slugChanged = newApp.slug !== originalApp.slug

    if (slugChanged) {
      const slugExists = await prisma.app.findUnique({
        where: {
          slug_teamId: {
            slug: newApp.slug,
            teamId: team.id,
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

    const imageUrl = await fetchUrlOgImage(newApp.androidUrl)

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
