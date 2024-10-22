import { supabaseMiddleware } from '@advents/supabase'
import { type NextRequest, NextResponse } from 'next/server'

export const apiAuthMiddleware = async (req: NextRequest) => {
  const { supabase, response } = supabaseMiddleware(req)

  const user = await supabase.auth.getUser()

  if (user.error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return response
}
