import { NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { IS_PRODUCTION } from '@/utils/env'

const teamSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
})

export async function POST(request: Request) {
  const host = request.headers.get('host')
  const isLocalhost = !host || !host.includes('localhost') || IS_PRODUCTION

  if (isLocalhost) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const data = teamSchema.parse(body)

    const newTeam = await prisma.team.create({
      data,
    })

    return NextResponse.json(newTeam, { status: 201 })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 400 },
    )
  }
}
