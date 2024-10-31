import { Loader2Icon } from 'lucide-react'
import { HTMLAttributes } from 'react'

import { cn } from '@/lib/tailwind'

export const LoadingPageContent = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('flex items-center justify-center gap-2', className)} {...props}>
      <Loader2Icon className='size-6 animate-spin' />
      Carregando...
    </div>
  )
}
