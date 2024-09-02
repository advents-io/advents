import { z } from 'zod'

export const getAppOutputSchema = z.object({
  id: z.string().uuid(),
  defaultDomain: z.string(),
  androidUrl: z.string().url(),
  iosUrl: z.string().url(),
  defaultFallbackUrl: z.string().url().optional(),
})

export type GetAppOutputProps = z.infer<typeof getAppOutputSchema>
