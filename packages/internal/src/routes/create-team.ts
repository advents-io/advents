import { prisma } from '@advents/db'
import { supabaseServer } from '@advents/supabase/server'
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
      const supabase = await supabaseServer()

      const {
        data: { users },
      } = await supabase.auth.admin.listUsers()

      if (!users.length) {
        return c.json({ error: 'No created users found.' }, 400)
      }

      const adminUser = users.find(user => user.email === 'gabriel@advents.io')

      if (!adminUser) {
        return c.json({ error: 'Admin user not found.' }, 400)
      }

      const data = c.req.valid('json')

      const team = await prisma.team.create({
        data: {
          ...data,
          createdBy: adminUser.id,
          updatedBy: adminUser.id,
        },
      })

      return c.json(team, 201)
    },
  )
