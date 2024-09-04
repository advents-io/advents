import { NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { supabaseAdminClient } from '@/lib/supabase'
import { IS_PRODUCTION } from '@/utils/env'

const inviteUserSchema = z.object({
  email: z.string({ message: 'Email inválido.' }).email('Email inválido.'),
  teamId: z.string({ message: 'Id da conta inválido.' }).uuid('Id da conta inválido.'),
})

export async function POST(req: Request) {
  const host = req.headers.get('host')
  const isLocalhost = !host || !host.includes('localhost') || IS_PRODUCTION

  if (isLocalhost) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { email, teamId } = inviteUserSchema.parse(body)

    const {
      data: { user },
      error: inviteUserError,
    } = await supabaseAdminClient().auth.admin.inviteUserByEmail(email)

    if (!user) {
      throw new Error(inviteUserError?.message || 'Erro ao enviar convite para o usuário.')
    }

    const member = await prisma.member.create({
      data: {
        userId: user.id,
        teamId,
      },
    })

    return NextResponse.json(member, { status: 201 })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 400 },
    )
  }
}
