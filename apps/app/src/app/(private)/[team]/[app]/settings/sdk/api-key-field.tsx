'use client'

import { toast } from 'sonner'

import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'

export function ApiKeyField({ apiKey }: { apiKey: string }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey)
    toast('Chave da API copiada.')
  }

  return (
    <div className='space-y-2'>
      <Label>Chave de API</Label>

      <div className='flex gap-2'>
        <Input id='api-key' type='text' value={apiKey} readOnly className='font-mono' />
        <Button onClick={copyToClipboard}>Copiar</Button>
      </div>

      <p className='text-sm text-muted-foreground'>
        Use a chave de API para autenticar as requisições da SDK instalada no seu app.
      </p>
    </div>
  )
}
