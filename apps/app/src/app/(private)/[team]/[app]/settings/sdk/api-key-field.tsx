'use client'

import { toast } from 'sonner'

import { Button } from '@/ui/button'
import { Input } from '@/ui/input'

export const ApiKeyField = ({ apiKey }: { apiKey: string }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey)
    toast('Chave da API copiada.')
  }

  return (
    <div className='flex flex-col gap-2 md:flex-row'>
      <Input id='api-key' type='text' value={apiKey} readOnly className='font-mono' />
      <Button onClick={copyToClipboard}>Copiar</Button>
    </div>
  )
}
