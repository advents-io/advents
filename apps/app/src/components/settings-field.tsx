import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/card'

type Props = {
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
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

      {hasHeader ? <CardContent>{children}</CardContent> : <CardHeader>{children}</CardHeader>}

      {footer && (
        <CardFooter className='border-t bg-gray-50 py-5 text-sm text-muted-foreground'>
          {footer}
        </CardFooter>
      )}
    </Card>
  )
}
