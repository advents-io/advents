import { SUPPORT_PHONE, whatsapp } from '@advents/common'
import Link from 'next/link'

import { SettingsField } from '@/components/settings-field'
import { Button } from '@/ui/button'

export default function Page() {
  const message = 'Olá, gostaria de adicionar um domínio customizado na Advents.'
  const whatsAppUrl = whatsapp.buildMessageUrl(SUPPORT_PHONE, message)

  return (
    <SettingsField
      fieldState={undefined}
      title='Domínios Customizados'
      footer={
        <>
          Entre em contato com a equipe da Advents para adicionar ou remover domínios customizados.
          <Link href={whatsAppUrl} target='_blank' className='ml-auto w-full sm:w-fit'>
            <Button size='sm' className='w-full'>
              Adicionar domínio
            </Button>
          </Link>
        </>
      }
    >
      <span className='leading-loose'>
        Adicione um domínio customizado da sua empresa para utilizar nos links.
        <br />
        Exemplo:{' '}
        <span className='font-mono font-semibold tracking-tighter text-primary'>
          https://links.meuapp.com/abcd123
        </span>
      </span>
    </SettingsField>
  )
}
