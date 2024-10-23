import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const supabaseServer = async (admin = false) => {
  /* BUG: this is preventing some pages from being static rendered on build, because the cookies make the page dynamic.
   * This started with the upgrade to Next.js 15.
   * Look at new versions os supabase js client to see if there is a workaround to it.
   */
  const cookiesStore = await cookies()

  return createServerClient(
    process.env.SUPABASE_URL!,
    admin ? process.env.SUPABASE_SERVICE_ROLE_KEY! : process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookiesStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookiesStore.set(name, value, options),
            )
          } catch {}
        },
      },
    },
  )
}

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
