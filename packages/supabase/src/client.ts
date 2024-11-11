import { createBrowserClient } from '@supabase/ssr'
import { User } from '@supabase/supabase-js'

import { removeSupabaseConsoleWarn } from './utils'

export const supabaseClient = () => {
  removeSupabaseConsoleWarn()

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

export const getSessionUser = async (): Promise<User | null> => {
  const supabase = supabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return session?.user || null
}
