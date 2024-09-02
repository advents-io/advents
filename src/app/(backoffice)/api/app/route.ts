import { NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { IS_PRODUCTION } from '@/utils/env'

const appSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  defaultDomain: z.string().min(1, 'Default domain is required'),
  androidUrl: z.string().url('Invalid Android URL'),
  iosUrl: z.string().url('Invalid iOS URL'),
  defaultFallbackUrl: z.string().url('Invalid fallback URL').optional(),
  qrCodeLogo: z.string().url('Invalid QR code logo URL').optional(),
  teamId: z.string().uuid('Invalid team ID'),
  createdBy: z.string().uuid('Invalid user ID'),
  updatedBy: z.string().uuid('Invalid user ID'),
})

export async function POST(request: Request) {
  const host = request.headers.get('host')
  const isLocalhost = !host || !host.includes('localhost') || IS_PRODUCTION

  if (isLocalhost) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const data = appSchema.parse(body)

    const newApp = await prisma.app.create({
      data,
    })

    return NextResponse.json(newApp, { status: 201 })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 400 },
    )
  }
}
