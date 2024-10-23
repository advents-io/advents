import { prisma } from '@advents/db'
import { supabaseServer } from '@advents/supabase'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const inviteUserSchema = z.object({
  email: z.string({ message: 'Email inválido.' }).email('Email inválido.'),
  teamId: z.string({ message: 'Id da conta inválido.' }).uuid('Id da conta inválido.'),
})

export async function POST(req: Request) {
  const host = req.headers.get('host')
  const isLocalhost = !host || host.includes('localhost')

  if (!isLocalhost || process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { email, teamId } = inviteUserSchema.parse(body)

    const supabase = await supabaseServer(true)

    const {
      data: { user },
      error: inviteUserError,
    } = await supabase.auth.admin.inviteUserByEmail(email)

    if (!user) {
      throw new Error(inviteUserError?.message || 'Erro ao enviar convite para o usuário.')
    }

    const {
      data: { users },
    } = await supabase.auth.admin.listUsers()

    if (!users.length) {
      throw new Error('No created users found.')
    }

    const adminUser = users.find(user => user.email === 'gabriel@advents.io')

    if (!adminUser) {
      throw new Error('Admin user not found.')
    }

    const member = await prisma.member.create({
      data: {
        userId: user.id,
        teamId,
        createdBy: adminUser.id,
        updatedBy: adminUser.id,
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
