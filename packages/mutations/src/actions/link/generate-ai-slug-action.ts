'use server'

import { prisma } from '@advents/db'
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { z } from 'zod'

import { authActionClient } from '../../safe-action'

const inputSchema = z.object({
  title: z.string(),
  domain: z.string({ message: 'Domínio inválido.' }),
})

export const generateAiSlugAction = authActionClient
  .schema(inputSchema)
  .action(async ({ parsedInput }) => {
    const { title, domain } = parsedInput

    // We could add authorization here, but I don't think it's necessary
    // because this do not change anything in the database.

    const existingSlugs = await prisma.link.findMany({
      where: {
        domain,
      },
      select: {
        slug: true,
      },
    })

    const { text: slug } = await generateText({
      model: openai('gpt-4o-mini'),
      system: `
               You are a digital marketing specialist responsible for generating short links for app install campaigns.
               These links are the same for iOS and Android apps.
               The format of the short link is: https://[domain]/[slug]
               `,
      prompt: `
               For the following link data, generate a URL-friendly slug for an app install campaign link.

               Link data:
               - Link description: ${title}
               - Link domain: ${domain}

               Requirements:
               - Language: Brazilian Portuguese (pt-BR)
               - Maximum length: 20 characters
               - Only use: lowercase letters, numbers, dashes (-)
               - Must be relevant to the link description.
               - Must be unique (avoid these slugs: ${existingSlugs.map(({ slug }) => slug).join(', ')})

               Format rules:
               1. No spaces (use dashes instead)
               2. No special characters or accents
               3. No uppercase letters
               4. No slashes or underscores

               Examples of good slugs:
               - For "Baixe nosso app de delivery": baixe-app
               - For "Promoção de verão": promo-verao
               - For "Ganhe desconto primeira compra": primeiro-desc

               Return only the slug, nothing else. No quotes, no explanations.
               `,
      maxTokens: 300,
      temperature: 0.5,
    })

    return {
      slug,
    }
  })
