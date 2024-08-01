import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import { env } from '@/utils/env'

export const supabaseClient = () => {
  const cookieStore = cookies()

  return createServerClient(env.SUPABASE_URL!, env.SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {}
      },
    },
  })
}
