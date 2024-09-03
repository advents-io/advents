import { NextResponse } from 'next/server'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { LINK_DOMAINS } from '@/utils/constants'
import { IS_PRODUCTION } from '@/utils/env'

const [first, ...rest] = LINK_DOMAINS

const appSchema = z.object({
  name: z.string({ message: 'Nome do app é obrigatório.' }).min(1, 'Nome do app é obrigatório.'),
  slug: z
    .string({ message: 'Slug do app é obrigatório.' })
    .min(1, 'Slug do app é obrigatório.')
    .max(100, 'O Slug do app deve possuir no máximo 100 caracteres.')
    .regex(
      /^[a-zA-Z0-9-_]*$/,
      'O Slug do app deve conter apenas letras, números, hifens ou underline.',
    ),
  defaultDomain: z.enum([first, ...rest], { message: 'Domínio inválido.' }),
  androidUrl: z
    .string({ message: 'Url inválida.' })
    .url('Url inválida.')
    .includes('play.google.com', {
      message: 'A url do app Android deve ser da Google Play Store.',
    }),
  iosUrl: z.string({ message: 'Url inválida.' }).url('Url inválida.').includes('apps.apple.com', {
    message: 'A url do app iOS deve ser da App Store.',
  }),
  defaultFallbackUrl: z.string({ message: 'Url inválida.' }).url('Url inválida.').optional(),
  qrCodeLogoUrl: z.string().url('Invalid QR code logo URL').optional(),
  teamId: z.string().uuid('Invalid team ID'),
  createdBy: z.string().uuid('Invalid user ID'),
  updatedBy: z.string().uuid('Invalid user ID'),
})

export async function POST(req: Request) {
  const host = req.headers.get('host')
  const isLocalhost = !host || !host.includes('localhost') || IS_PRODUCTION

  if (isLocalhost) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const data = appSchema.parse(body)

    const imageUrl = await fetchUrlOgImage(data.androidUrl)

    const app = await prisma.app.create({
      data: {
        ...data,
        imageUrl,
      },
    })

    return NextResponse.json(app, { status: 201 })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 400 },
    )
  }
}

const fetchUrlOgImage = async (url: string) => {
  const response = await fetch(url)
  const html = await response.text()

  const ogImageMatch = html.match(/<meta property="og:image" content="(.*?)">/)

  if (!ogImageMatch) {
    throw new Error('No OG image found')
  }

  return ogImageMatch[1]
}
