'use client'

import { QueryClientProvider } from '@tanstack/react-query'

import { getQueryClient } from '@/lib/react-query'
import { TooltipProvider } from '@/ui/tooltip'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={100}>{children}</TooltipProvider>
    </QueryClientProvider>
  )
}
