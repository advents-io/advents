import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string(),
  DIRECT_URL: z.string(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string(),
})

const serverRuntime = typeof window === 'undefined'

export const env = serverRuntime
  ? envSchema.parse(process.env)
  : {
      DATABASE_URL: '',
      DIRECT_URL: '',
      SUPABASE_URL: '',
      SUPABASE_ANON_KEY: '',
    }

export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
