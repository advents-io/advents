import { AlertCircle } from 'lucide-react'
import React from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/ui/alert'

interface Props extends Pick<React.HTMLAttributes<HTMLDivElement>, 'className'> {
  error?: string | null
}

export const ErrorAlert = ({ error, className }: Props) => {
  if (!error) {
    return null
  }

  return (
    <Alert variant='destructive' className={className}>
      <AlertCircle className='size-4' />
      <AlertTitle>Ops!</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )
}
