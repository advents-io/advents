import { prisma } from '@advents/db'
import { supabaseServer } from '@advents/supabase/server'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

import { ApiEnv } from '../api'

const inputSchema = z.object({
  email: z.string({ message: 'Email inválido.' }).email('Email inválido.'),
  teamId: z.string({ message: 'Id da conta inválido.' }).uuid('Id da conta inválido.'),
})

export const inviteUser = (api: Hono<ApiEnv>) =>
  api.post(
    'user', //
    zValidator('json', inputSchema),
    async c => {
      const data = c.req.valid('json')

      const supabase = await supabaseServer()

      const {
        data: { user },
        error: inviteUserError,
      } = await supabase.auth.admin.inviteUserByEmail(data.email)

      if (!user) {
        return c.json(
          { error: inviteUserError?.message || 'Erro ao enviar convite para o usuário.' },
          400,
        )
      }

      const member = await prisma.member.create({
        data: {
          userId: user.id,
          teamId: data.teamId,
          createdBy: c.var.user.id,
          updatedBy: c.var.user.id,
        },
      })

      return c.json(member, 201)
    },
  )
