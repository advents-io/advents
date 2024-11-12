import { SUPPORT_PHONE } from '@advents/common'
import Link from 'next/link'

import { SettingsField } from '@/components/settings-field'
import { whatsapp } from '@/lib/whatsapp'
import { Button } from '@/ui/button'

export default function Page() {
  const message = 'Olá, gostaria de adicionar um domínio customizado na Advents.'
  const whatsAppUrl = whatsapp.buildMessageUrl(SUPPORT_PHONE, message)

  return (
    <SettingsField
      title='Domínios Customizados'
      description={
        <span className='leading-loose'>
          Adicione um domínio customizado da sua empresa para utilizar nos links.
          <br />
          Exemplo:{' '}
          <span className='font-mono font-semibold tracking-tighter text-primary'>
            https://links.meuapp.com/abcd123
          </span>
        </span>
      }
      footer={
        <div className='flex w-full items-center justify-between gap-2'>
          Entre em contato com a equipe da Advents para adicionar ou remover domínios customizados.
          <Link href={whatsAppUrl} target='_blank'>
            <Button size='sm'>Adicionar domínio</Button>
          </Link>
        </div>
      }
    />
  )
}
