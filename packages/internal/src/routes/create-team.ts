import { prisma } from '@advents/db'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

import { ApiEnv } from '../api'

const inputSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
})

export const createTeam = (api: Hono<ApiEnv>) =>
  api.post(
    'team', //
    zValidator('json', inputSchema),
    async c => {
      const data = c.req.valid('json')

      const team = await prisma.team.create({
        data: {
          ...data,
          createdBy: c.var.user.id,
          updatedBy: c.var.user.id,
        },
      })

      return c.json(team, 201)
    },
  )
