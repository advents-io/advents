import { z } from 'zod'

const getLinkAnalyticsOutputSchema = z.object({
  slug: z.string(),
  domain: z.string(),
  title: z.string().nullable(),
  clicks: z.number(),
  installs: z.number(),
  createdAt: z.date(),
})

export const getLinksAnalyticsOutputSchema = z.array(getLinkAnalyticsOutputSchema)

export type GetLinkAnalyticsOutput = z.infer<typeof getLinkAnalyticsOutputSchema>
