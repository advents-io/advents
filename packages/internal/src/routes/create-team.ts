import { prisma } from '@advents/db'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

import { ApiEnv } from '../api'
import { createAdminUsersMember } from '../handlers/create-admin-users-member'
import { handleInviteUser } from '../handlers/invite-user'

const inputSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  users: z
    .array(
      z.object({
        email: z.string().email('Invalid email'),
      }),
    )
    .optional(),
})

export const createTeam = (api: Hono<ApiEnv>) =>
  api.post(
    '/team', //
    zValidator('json', inputSchema),
    async c => {
      const { name, slug, users } = c.req.valid('json')

      const team = await prisma.team.create({
        data: {
          name,
          slug,
          createdBy: c.var.user.id,
          updatedBy: c.var.user.id,
        },
      })

      const invitedUsers: string[] = []

      if (users && users.length > 0) {
        for (const user of users) {
          try {
            await handleInviteUser({
              email: user.email,
              teamId: team.id,
              createdByUserId: c.var.user.id,
            })

            invitedUsers.push(`Invite sent to ${user.email}`)
          } catch (e) {
            const error = (e as Error).message
            invitedUsers.push(`Error inviting ${user.email}: ${error}`)
          }
        }
      }

      await createAdminUsersMember({ teamId: team.id, createdByUserId: c.var.user.id })

      return c.json(
        {
          team,
          users: invitedUsers,
        },
        201,
      )
    },
  )
