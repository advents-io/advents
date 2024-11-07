import { createBrowserClient } from '@supabase/ssr'

import { removeSupabaseConsoleWarn } from './utils'

export const supabaseClient = () => {
  removeSupabaseConsoleWarn()

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
