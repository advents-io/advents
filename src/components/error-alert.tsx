import { AlertCircle } from 'lucide-react'
import React from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/ui/alert'

interface Props {
  error?: string | null
}

export const ErrorAlert = ({ error }: Props) => {
  if (!error) {
    return null
  }

  return (
    <Alert variant='destructive'>
      <AlertCircle className='size-4' />
      <AlertTitle>Ops!</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )
}
