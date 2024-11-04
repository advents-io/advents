'use server'

import { routes } from '@advents/common'
import { prisma } from '@advents/db'
import { redirect } from 'next/navigation'

import { ActionError } from '../../action-errors'
import { authActionClient } from '../../safe-action'
import { deleteAppInputSchema } from '../../schemas/input/app/delete-app-input'

export const deleteAppAction = authActionClient
  .schema(deleteAppInputSchema)
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
        id: true,
        team: {
          select: {
            slug: true,
          },
        },
      },
    })

    if (!app) {
      throw new ActionError('App não encontrado.')
    }

    await prisma.app.delete({
      where: {
        id: app.id,
      },
    })

    redirect(routes.APPS.path(app.team.slug))
  })
