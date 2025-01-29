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

    // We could add authorization here, but I don't think it's necessary
    // because this do not change anything in the database.

    return {
      slug: await generateRandomSlug(domain),
    }
  })
