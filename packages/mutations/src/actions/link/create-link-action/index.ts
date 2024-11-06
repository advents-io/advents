'use server'

import { prisma } from '@advents/db'

import { ActionError } from '../../../action-errors'
import { authActionClient } from '../../../safe-action'
import { generateRandomSlug } from '../../../utils/link-helper'
import { inputSchema } from './schema'

export const createLinkAction = authActionClient
  .schema(inputSchema)
  .action(async ({ parsedInput, ctx: { user } }) => {
    const {
      title,
      domain,
      slug: reqSlug,
      iosUrl,
      androidUrl,
      fallbackUrl,
      campaignCost,
      appId,
    } = parsedInput

    const app = await prisma.app.findUnique({
      where: {
        id: appId,
        team: {
          members: {
            some: {
              userId: user.id,
            },
          },
        },
      },
      select: {
        id: true,
      },
    })

    if (!app) {
      throw new ActionError('App não encontrado.')
    }

    if (reqSlug) {
      const linkExists = await prisma.link.findUnique({
        select: { id: true },
        where: {
          domain_slug: {
            domain,
            slug: reqSlug,
          },
        },
      })

      if (linkExists) {
        throw new ActionError(`Link duplicado.\n\nO link curto "${reqSlug}" já existe.`)
      }
    }

    const slug = reqSlug || (await generateRandomSlug(domain))

    await prisma.link.create({
      data: {
        title,
        domain,
        slug,
        iosUrl,
        androidUrl,
        fallbackUrl,
        campaignCost,
        appId,
        createdBy: user.id,
        updatedBy: user.id,
      },
    })
  })
