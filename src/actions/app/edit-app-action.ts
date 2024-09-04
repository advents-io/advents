'use server'

import { redirect } from 'next/navigation'

import { actionClient, ActionError } from '@/actions/safe-action'
import { editAppInputSchema } from '@/actions/schemas/input/app/edit-app-input'
import { fetchUrlOgImage } from '@/helpers/og-helper'
import { prisma } from '@/lib/prisma'
import { supabaseClient } from '@/lib/supabase'
import { routes } from '@/utils/routes'

export const editAppAction = actionClient
  .schema(editAppInputSchema)
  .action(async ({ parsedInput }) => {
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
      throw new ActionError('Time não encontrado.')
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

    const {
      data: { user },
    } = await supabaseClient().auth.getUser()

    if (!user) {
      throw new ActionError('Usuário não encontrado.')
    }

    const app = {
      ...originalApp,
      ...newApp,
      updatedBy: user.id,
    }

    const imageUrl = await fetchUrlOgImage(newApp.androidUrl)

    if (imageUrl && imageUrl !== originalApp.imageUrl) {
      app.imageUrl = imageUrl
    }

    await prisma.app.update({
      where: {
        id,
      },
      data: app,
    })

    redirect(routes.SETTINGS.path(team.slug, app.slug))
  })
