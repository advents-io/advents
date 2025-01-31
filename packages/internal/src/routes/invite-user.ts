import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

import { ApiEnv } from '../api'
import { handleInviteUser } from '../handlers/invite-user'

const inputSchema = z.object({
  email: z.string({ message: 'Email inválido.' }).email('Email inválido.'),
  teamId: z.string({ message: 'Id da conta inválido.' }).uuid('Id da conta inválido.'),
})

export const inviteUser = (api: Hono<ApiEnv>) =>
  api.post(
    '/user', //
    zValidator('json', inputSchema),
    async c => {
      const { email, teamId } = c.req.valid('json')

      try {
        await handleInviteUser({
          email,
          teamId,
          createdByUserId: c.var.user.id,
        })
      } catch (error) {
        return c.json({ error: (error as Error).message }, 400)
      }

      return c.newResponse(null, 201)
    },
  )
