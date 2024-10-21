import { prisma } from '@advents/db'
import { supabaseAdminClient } from '@advents/supabase'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const teamSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
})

export async function POST(req: Request) {
  const host = req.headers.get('host')
  const isLocalhost = !host || host.includes('localhost')

  if (!isLocalhost || process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const data = teamSchema.parse(body)

    const {
      data: { users },
    } = await supabaseAdminClient().auth.admin.listUsers()

    if (!users.length) {
      throw new Error('No created users found.')
    }

    const adminUser = users.find(user => user.email === 'gabriel@advents.io')

    if (!adminUser) {
      throw new Error('Admin user not found.')
    }

    const team = await prisma.team.create({
      data: {
        ...data,
        createdBy: adminUser.id,
        updatedBy: adminUser.id,
      },
    })

    return NextResponse.json(team, { status: 201 })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 400 },
    )
  }
}
