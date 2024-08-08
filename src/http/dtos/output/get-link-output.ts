import { z } from 'zod'

export const getLinkOutputSchema = z.object({
  id: z.string().uuid(),
  domain: z.string(),
  slug: z.string(),
  androidUrl: z.string().url().includes('play.google.com'),
  iosUrl: z.string().url().includes('apps.apple.com'),
  fallbackUrl: z.string().url(),
})

export type GetLinkOutputProps = z.infer<typeof getLinkOutputSchema>
