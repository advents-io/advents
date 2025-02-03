import { prisma } from '@advents/db'
import { supabaseServerAdmin } from '@advents/supabase/server'
import { Hono } from 'hono'

import { ApiEnv } from '../api'

export const addAdminsToAllTeams = (api: Hono<ApiEnv>) =>
  api.post(
    '/teams/add-admins', //
    async c => {
      const adminUsersIds = process.env.ADMIN_USERS?.split(',')

      if (!adminUsersIds) {
        return c.json({ error: 'ADMIN_USERS is not set.' }, 500)
      }

      if (adminUsersIds.length === 0) {
        return c.json({ error: 'ADMIN_USERS is empty.' }, 500)
      }

      const supabase = await supabaseServerAdmin()

      const users = (
        await Promise.all(
          adminUsersIds.map(async userId => {
            const { data } = await supabase.auth.admin.getUserById(userId)
            return data?.user
          }),
        )
      ).filter(Boolean)

      const teams = await prisma.team.findMany({
        select: {
          id: true,
          name: true,
          members: {
            select: {
              userId: true,
            },
          },
        },
      })

      const logs: string[] = []

      for (const team of teams) {
        for (const user of users) {
          try {
            if (!user) {
              continue
            }

            if (team.members.some(member => member.userId === user.id)) {
              continue
            }

            await prisma.member.create({
              data: {
                teamId: team.id,
                userId: user.id,
                createdBy: c.var.user.id,
                updatedBy: c.var.user.id,
              },
            })

            logs.push(`Added ${user.email} to ${team.name}`)
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            logs.push(`Error adding ${user?.email} to ${team.name}: ${errorMessage}`)
          }
        }
      }

      return c.json({ logs }, 200)
    },
  )
