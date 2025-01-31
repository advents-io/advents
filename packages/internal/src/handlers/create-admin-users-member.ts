import { prisma } from '@advents/db'

type Params = {
  teamId: string
  createdByUserId: string
}

export const createAdminUsersMember = async ({ teamId, createdByUserId }: Params) => {
  try {
    const adminUsers = process.env.ADMIN_USERS?.split(',')

    if (!adminUsers || adminUsers.length === 0) {
      return
    }

    await prisma.member.createMany({
      data: adminUsers.map(userId => ({
        userId,
        teamId,
        createdBy: createdByUserId,
        updatedBy: createdByUserId,
      })),
    })
  } catch {}
}
