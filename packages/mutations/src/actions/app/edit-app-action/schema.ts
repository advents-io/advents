import { z } from 'zod'

import { createAppInputSchema } from '../create-app-action/schema'

export const editAppFormInputSchema = createAppInputSchema.extend({
  disableIosPreviewPage: z.boolean(),
})

export type EditAppFormInput = z.infer<typeof editAppFormInputSchema>
