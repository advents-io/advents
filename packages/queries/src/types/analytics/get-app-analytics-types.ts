import { z } from 'zod'

import {
  getAppAnalyticsInputSchema,
  getAppAnalyticsOutputSchema,
} from '../../routes/analytics/get-app-analytics'

export type GetAppAnalyticsInput = z.infer<typeof getAppAnalyticsInputSchema>
export type GetAppAnalyticsOutput = z.infer<typeof getAppAnalyticsOutputSchema>
