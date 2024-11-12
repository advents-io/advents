import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/card'
import { Skeleton } from '@/ui/skeleton'

type Props = {
  title?: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  footer?: React.ReactNode
}

export const SettingsField = ({ title, description, children, footer }: Props) => {
  const hasHeader = !!title || !!description

  return (
    <Card className='mb-10 overflow-hidden'>
      {hasHeader && (
        <CardHeader>
          {title && <CardTitle className='text-xl'>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}

      {hasHeader && !!children ? (
        <CardContent>{children}</CardContent>
      ) : children ? (
        <CardHeader>{children}</CardHeader>
      ) : null}

      {footer && (
        <CardFooter className='border-t bg-gray-50 py-5 text-sm text-muted-foreground'>
          {footer}
        </CardFooter>
      )}
    </Card>
  )
}

export const SettingsFieldLoading = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className='h-8 w-1/4' />
      </CardHeader>

      <CardContent className='space-y-4'>
        <Skeleton className='h-5 w-1/2' />
        <Skeleton className='h-5 w-1/3' />
      </CardContent>

      <CardFooter className='flex justify-between border-t bg-gray-50 py-5'>
        <Skeleton className='h-5 w-1/2' />
        <Skeleton className='h-8 w-1/12' />
      </CardFooter>
    </Card>
  )
}
