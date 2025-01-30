import { z } from 'zod'

import { baseCreateAppInputSchema } from '../create-app-action/schema'

export const editAppFormInputSchema = baseCreateAppInputSchema.extend({
  disableIosPreviewPage: z.boolean(),
})

export type EditAppFormInput = z.infer<typeof editAppFormInputSchema>
