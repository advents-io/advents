import { Hono } from 'hono'

import { authMiddleware, AuthMiddlewareEnv } from './auth-middleware'
import { addAdminsToAllTeams } from './routes/add-admins-to-all-teams'
import { createTeam } from './routes/create-team'
import { inviteUser } from './routes/invite-user'

export type ApiEnv = AuthMiddlewareEnv

export const api = new Hono<ApiEnv>({
  strict: false,
}).basePath('/api/internal')

api.use(authMiddleware)

createTeam(api)
inviteUser(api)
addAdminsToAllTeams(api)
