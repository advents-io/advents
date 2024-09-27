import { z } from 'zod'

export const getLinkOutputSchema = z.object({
  id: z.string().uuid(),
  title: z.string().nullable(),
  domain: z.string(),
  slug: z.string(),
  androidUrl: z.string().url(),
  iosUrl: z.string().url(),
  fallbackUrl: z.string().url(),
})

export type GetLinkOutputProps = z.infer<typeof getLinkOutputSchema>
