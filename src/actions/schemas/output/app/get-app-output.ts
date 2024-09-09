import { z } from 'zod'

export const getAppDefaultValuesOutputSchema = z.object({
  defaultDomain: z.string(),
  androidUrl: z.string().url(),
  iosUrl: z.string().url(),
  defaultFallbackUrl: z.string().url().nullable(),
})

export type GetAppDefaultValuesOutputProps = z.infer<typeof getAppDefaultValuesOutputSchema>

export const getAppOutputSchema = getAppDefaultValuesOutputSchema.extend({
  name: z.string(),
  slug: z.string(),
  imageUrl: z.string().url(),
  qrcodeLogoUrl: z.string().url().nullable(),
})

export type GetAppOutputProps = z.infer<typeof getAppOutputSchema>
