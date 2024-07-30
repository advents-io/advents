import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function POST() {
  await prisma.link.create({
    data: {
      domain: 'l.advents.io',
      slug: 'teste3',
      iosUrl: 'https://apps.apple.com/br/app/id1598991618?platform=iphone',
      androidUrl: 'https://play.google.com/store/apps/details?id=com.quebarbada.quebarbada',
      fallbackUrl: 'https://favorito.digital',
    },
  })

  return NextResponse.json(null, { status: 201 })
}
