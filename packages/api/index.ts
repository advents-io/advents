import { handle } from 'hono/vercel'

import { api } from '@/api'
import { logClick } from '@/click-helper'

export { api, handle, logClick }
