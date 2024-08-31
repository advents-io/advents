import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

import { env } from '@/utils/env'
import { routes } from '@/utils/routes'

export const authMiddleware = async (req: NextRequest) => {
  let response = NextResponse.next({
    request: req,
  })

  const supabase = createServerClient(env.SUPABASE_URL!, env.SUPABASE_ANON_KEY!, {
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

  const isProtectedRoute = Object.values(routes).some(
    route => route.path === req.nextUrl.pathname && route.protected === true,
  )

  if (isProtectedRoute && user.error) {
    return NextResponse.redirect(new URL(routes.SIGN_IN.path, req.url))
  }

  if (!isProtectedRoute && !user.error) {
    return NextResponse.redirect(new URL(routes.LINKS.path, req.url))
  }

  return response
}
