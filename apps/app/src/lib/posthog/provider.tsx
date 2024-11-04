'use client'

import { supabaseClient } from '@advents/supabase/client'
import posthog from 'posthog-js'
import { PostHogProvider as PostHogProviderBase } from 'posthog-js/react'
import { useEffect } from 'react'

export const PostHogProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY

    if (posthogKey) {
      posthog.init(posthogKey, {
        api_host: 'https://us.i.posthog.com',
        person_profiles: 'identified_only',
        capture_pageview: false, // Disable automatic pageview capture, as we capture manually
        capture_pageleave: true,
        capture_heatmaps: true,
        capture_performance: true,
        enable_recording_console_log: true,
        enable_heatmaps: true,
      })
    }
  }, [])

  useEffect(() => {
    const supabase = supabaseClient()

    const subscribe = supabase.auth.onAuthStateChange((event, session) => {
      switch (event) {
        case 'SIGNED_IN':
          if (session?.user) {
            posthog.identify(session.user.id, { email: session.user.email })
          }

          break

        case 'SIGNED_OUT':
          posthog.reset()

          break

        default:
          break
      }
    })

    return () => subscribe.data.subscription.unsubscribe()
  }, [])

  return <PostHogProviderBase client={posthog}>{children}</PostHogProviderBase>
}
