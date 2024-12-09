import { prisma } from '@advents/db'
import { supabaseServer } from '@advents/supabase/server'

type Params = {
  email: string
  teamId: string
  createdByUserId: string
}

export const handleInviteUser = async ({ email, teamId, createdByUserId }: Params) => {
  const supabase = await supabaseServer()

  const {
    data: { user },
    error: inviteUserError,
  } = await supabase.auth.admin.inviteUserByEmail(email)

  if (!user) {
    throw new Error(inviteUserError?.message || 'Erro ao enviar convite para o usuário.')
  }

  await prisma.member.create({
    data: {
      userId: user.id,
      teamId,
      createdBy: createdByUserId,
      updatedBy: createdByUserId,
    },
  })
}
