import { NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { IS_PRODUCTION } from '@/utils/env'

const memberSchema = z.object({
  userId: z.string().uuid('Valid user ID is required'),
  teamId: z.string().uuid('Valid team ID is required'),
})

export async function POST(req: Request) {
  const host = req.headers.get('host')
  const isLocalhost = !host || !host.includes('localhost') || IS_PRODUCTION

  if (isLocalhost) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const data = memberSchema.parse(body)

    const member = await prisma.member.create({
      data,
    })

    return NextResponse.json(member, { status: 201 })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 400 },
    )
  }
}
