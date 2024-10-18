import { createServerClient } from '@advents/supabase'
import { type NextRequest, NextResponse } from 'next/server'

export const apiAuthMiddleware = async (req: NextRequest) => {
  let response = NextResponse.next({
    request: req,
  })

  const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return req.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
        response = NextResponse.next({
          request: req,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        )
      },
    },
  })

  const user = await supabase.auth.getUser()

  if (user.error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return response
}
