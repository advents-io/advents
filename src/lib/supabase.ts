import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const supabaseClient = () => {
  const cookieStore = cookies()

  const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env

  return createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
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
