'use server'

import { prisma } from '@advents/prisma'

export async function createLink() {
  await prisma.link.create({
    data: {
      domain: 'l.advents.io',
      slug: 'teste2',
      iosUrl: 'https://apps.apple.com/br/app/id1598991618?platform=iphone',
      androidUrl: 'https://play.google.com/store/apps/details?id=com.quebarbada.quebarbada',
      fallbackUrl: 'https://favorito.digital',
    },
  })
}
