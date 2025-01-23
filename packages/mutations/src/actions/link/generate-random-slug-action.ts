'use server'

import { z } from 'zod'

import { authActionClient } from '../../safe-action'
import { generateRandomSlug } from '../../utils/link-helper'

const inputSchema = z.object({
  domain: z.string({ message: 'Domínio inválido.' }),
})

export const generateRandomSlugAction = authActionClient
  .schema(inputSchema)
  .action(async ({ parsedInput }) => {
    const { domain } = parsedInput

    // TODO: add authorization

    return {
      slug: await generateRandomSlug(domain),
    }
  })
