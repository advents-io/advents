import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const supabaseServer = (admin = false) =>
  createServerClient(
    process.env.SUPABASE_URL!,
    admin ? process.env.SUPABASE_SERVICE_ROLE_KEY! : process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          const cookiesStore = await cookies()
          return cookiesStore.getAll()
        },
        setAll() {},
      },
    },
  )

const supabaseMiddleware = (request: NextRequest) => {
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))

        response = NextResponse.next({
          request,
        })

        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        )
      },
    },
  })

  return {
    response,
    supabase,
  }
}

export { supabaseMiddleware, supabaseServer }
