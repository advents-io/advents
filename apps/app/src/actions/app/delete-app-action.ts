'use server'

import { prisma } from '@advents/db'
import { redirect } from 'next/navigation'

import { ActionError } from '@/actions/action-errors'
import { authActionClient } from '@/actions/safe-action'
import { deleteAppInputSchema } from '@/actions/schemas/input/app/delete-app-input'
import { routes } from '@/utils/routes'

export const deleteAppAction = authActionClient
  .schema(deleteAppInputSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { appSlug } = parsedInput

    const team = await prisma.team.findFirst({
      where: {
        members: {
          some: {
            userId: user.id,
          },
        },
      },
    })

    if (!team) {
      throw new ActionError('Conta não encontrada.')
    }

    await prisma.app.delete({
      where: {
        slug_teamId: {
          slug: appSlug,
          teamId: team.id,
        },
      },
    })

    redirect(routes.APPS.path(team.slug))
  })
