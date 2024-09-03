import { z } from 'zod'

export const getAppDefaultValuesOutputSchema = z.object({
  defaultDomain: z.string(),
  androidUrl: z.string().url(),
  iosUrl: z.string().url(),
  defaultFallbackUrl: z.string().url().optional(),
})

export type GetAppDefaultValuesOutputProps = z.infer<typeof getAppDefaultValuesOutputSchema>
