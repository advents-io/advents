import { Fragment } from 'react'
import { ControllerFieldState } from 'react-hook-form'

import { cn } from '@/lib/tailwind'
import { Button } from '@/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/ui/card'
import { FormControl, FormItem, FormMessage } from '@/ui/form'
import { Skeleton } from '@/ui/skeleton'

import { LoadingSpinner } from './loading-spinner'

interface Props extends Pick<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  fieldState: ControllerFieldState | undefined
  busy?: boolean
  title: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  footerLabel?: React.ReactNode
  footerButtonLabel?: string
  footerButtonOnClick?: () => void
  isDestructive?: boolean
}

export const SettingsField = ({
  fieldState,
  busy,
  title,
  children,
  footer,
  footerLabel,
  footerButtonLabel,
  footerButtonOnClick,
  isDestructive,
  className,
}: Props) => {
  const isValidFormItem = !!fieldState
  const hasError = !!fieldState?.error

  const Container = isValidFormItem ? FormItem : Fragment
  const Control = isValidFormItem ? FormControl : Fragment
  const ErrorMessage = isValidFormItem ? FormMessage : Fragment

  return (
    <Container>
      <Card
        className={cn(
          'overflow-hidden',
          isDestructive && 'border-red-200',
          hasError && 'border-destructive',
          className,
        )}
      >
        <CardHeader>
          <CardTitle className='text-xl'>{title}</CardTitle>
        </CardHeader>

        <Control>
          <CardContent className='space-y-4 text-sm'>
            {children}

            <ErrorMessage />
          </CardContent>
        </Control>

        {(footer || footerLabel || footerButtonLabel || footerButtonOnClick) && (
          <CardFooter
            className={cn(
              'min-h-[77px] border-t bg-gray-50 py-5 text-sm text-muted-foreground',
              isDestructive && 'border-t-red-200 bg-red-50',
              hasError && 'border-t-destructive',
            )}
          >
            <div className='flex w-full flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
              {footer || (
                <>
                  {footerLabel}

                  {(footerButtonLabel || footerButtonOnClick) && (
                    <Button
                      disabled={!fieldState?.isDirty || busy}
                      type='button'
                      size='sm'
                      variant={isDestructive ? 'destructive' : 'default'}
                      className='ml-auto w-full sm:w-fit'
                      onClick={footerButtonOnClick}
                    >
                      <LoadingSpinner loading={!!busy}>
                        {footerButtonLabel || 'Salvar'}
                      </LoadingSpinner>
                    </Button>
                  )}
                </>
              )}
            </div>
          </CardFooter>
        )}
      </Card>
    </Container>
  )
}

export const SettingsFieldLoading = () => {
  return (
    <Card className='overflow-hidden'>
      <CardHeader>
        <Skeleton className='h-7 w-1/4' />
      </CardHeader>

      <CardContent className='space-y-4'>
        <Skeleton className='h-5 w-1/2' />
        <Skeleton className='h-10 w-1/2' />
      </CardContent>

      <CardFooter className='flex min-h-[77px] justify-between border-t bg-gray-50 py-5'>
        <Skeleton className='ml-auto h-9 w-24' />
      </CardFooter>
    </Card>
  )
}
