import { z } from 'zod'

export const getAppAnalyticsInputSchema = z.object({
  appSlug: z.string({ message: 'Slug do app é obrigatório.' }),
  startDate: z.date({ message: 'Data de início é obrigatória.' }),
  endDate: z.date({ message: 'Data de fim é obrigatória.' }),
})
