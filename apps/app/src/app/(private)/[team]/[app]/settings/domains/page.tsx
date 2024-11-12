import { SUPPORT_PHONE } from '@advents/common'
import Link from 'next/link'

import { SettingsField } from '@/components/settings-field'
import { whatsapp } from '@/lib/whatsapp'
import { Button } from '@/ui/button'

export default async function Page() {
  const message = 'Olá, gostaria de adicionar um domínio customizado na Advents.'
  const whatsAppUrl = whatsapp.buildMessageUrl(SUPPORT_PHONE, message)

  return (
    <SettingsField
      title='Domínios'
      description={
        <span>
          Adicione domínios customizados da sua empresa para utilizar nos links.
          <br />
          <span>
            Exemplo:{' '}
            <span className='font-mono font-semibold tracking-tighter text-primary'>
              https://links.seudominio.com/abcd123
            </span>
          </span>
        </span>
      }
    >
      <div className='flex flex-col gap-2'>
        Entre em contato com a equipe da Advents para adicionar ou remover domínios customizados.
        <Link href={whatsAppUrl} target='_blank'>
          <Button className='w-fit'>Entrar em contato</Button>
        </Link>
      </div>
    </SettingsField>
  )
}
