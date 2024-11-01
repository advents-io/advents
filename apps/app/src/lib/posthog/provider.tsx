'use client'

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

  return <PostHogProviderBase client={posthog}>{children}</PostHogProviderBase>
}
