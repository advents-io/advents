import { routes } from '@advents/common'
import { createServerClient } from '@advents/supabase'
import { type NextRequest, NextResponse } from 'next/server'

export const appAuthMiddleware = async (req: NextRequest) => {
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

  const isPrivateRoute = getIsPrivateRoute(req.nextUrl.pathname)

  if (isPrivateRoute && user.error) {
    return NextResponse.redirect(new URL(routes.SIGN_IN.path, req.url))
  }

  if (!isPrivateRoute && !user.error) {
    return NextResponse.redirect(new URL(routes.TEAMS.path, req.url))
  }

  return response
}

const getIsPrivateRoute = (path: string) => {
  const publicRoutes = [routes.SIGN_IN.path, routes.IOS_CLICK.path]

  return !publicRoutes.includes(path)
}
