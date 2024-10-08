import { z } from 'zod'

export const getLinksAnalyticsInputSchema = z.object({
  appSlug: z.string({ message: 'Slug do app é obrigatório.' }),
})
