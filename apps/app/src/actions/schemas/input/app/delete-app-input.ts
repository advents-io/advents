import { z } from 'zod'

export const deleteAppInputSchema = z.object({
  appSlug: z.string({ message: 'Slug do app em formato inválido.' }),
})
