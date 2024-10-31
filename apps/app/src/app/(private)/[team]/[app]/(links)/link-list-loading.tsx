import { Card, CardContent } from '@/ui/card'
import { Skeleton } from '@/ui/skeleton'

export const LinkListLoading = () => {
  return (
    <div className='space-y-4'>
      {Array.from({ length: 30 }).map((_, index) => (
        <Card key={index}>
          <CardContent className='flex px-6 py-4'>
            <div className='flex h-16 w-full items-center gap-2'>
              <Skeleton className='h-6 w-full' />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
