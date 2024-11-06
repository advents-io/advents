import { supabaseClient } from '@advents/supabase/client'
import ky from 'ky'

export const queries = ky.create({
  prefixUrl: '/api',
  timeout: 60 * 1000,
  hooks: {
    beforeRequest: [
      async request => {
        const supabase = supabaseClient()

        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          request.headers.set('Authorization', `Bearer ${session.access_token}`)
        } else {
          request.headers.delete('Authorization')
        }

        return request
      },
    ],
  },
})
