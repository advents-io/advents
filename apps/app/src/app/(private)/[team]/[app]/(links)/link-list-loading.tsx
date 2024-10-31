import { Card, CardContent } from '@/ui/card'
import { Skeleton } from '@/ui/skeleton'

export const LinkListLoading = () => {
  return (
    <div className='space-y-4'>
      {Array.from({ length: 10 }).map((_, index) => (
        <Card key={index}>
          <CardContent className='flex px-6 py-4'>
            <div className='flex h-16 w-full items-center gap-2'>
              <div className='max-w-sm space-y-2'>
                <Skeleton className='h-6 w-72' />
                <Skeleton className='h-6 w-44' />
              </div>

              <div className='flex flex-1 items-center justify-end gap-2'>
                <Skeleton className='hidden h-6 w-18 md:flex' />
                <Skeleton className='hidden h-6 w-24 sm:flex' />
                <Skeleton className='hidden h-6 w-24 sm:flex' />
                <Skeleton className='size-8' />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
