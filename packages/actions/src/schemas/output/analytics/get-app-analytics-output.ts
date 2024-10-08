import { z } from 'zod'

export const getAppAnalyticsOutputSchema = z.object({
  clicks: z.number(),
  clicksIncrease: z.number(),
  installs: z.number(),
  installsIncrease: z.number(),
  cti: z.number(),
  ctiIncrease: z.number(),
  revenue: z.number(),
  revenueIncrease: z.number(),
})
