import { supabaseMiddleware } from '@advents/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'

export const apiAuthMiddleware = async (req: NextRequest) => {
  const { supabase, response } = supabaseMiddleware(req)

  const user = await supabase.auth.getUser()

  if (user.error) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  return response
}
