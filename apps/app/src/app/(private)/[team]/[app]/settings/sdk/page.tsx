import { DOCS_URL } from '@advents/common'
import { prisma } from '@advents/db'
import { SquareArrowOutUpRightIcon } from 'lucide-react'
import Link from 'next/link'

import { ErrorAlert } from '@/components/error-alert'
import { SettingsField } from '@/components/settings-field'

import { ApiKeyField } from './api-key-field'

export default async function Page(props: { params: Promise<{ app: string; team: string }> }) {
  const params = await props.params

  const apiKey = await prisma.apiKey.findFirst({
    where: {
      app: {
        slug: params.app,
        team: {
          slug: params.team,
        },
      },
    },
    select: {
      key: true,
    },
  })

  if (!apiKey) {
    return <ErrorAlert error='Não foi possível encontrar a chave de API.' />
  }

  const docsUrl = new URL('/chave-da-api', DOCS_URL).toString()

  return (
    <SettingsField
      title='Chave da API'
      footer={
        <p className='flex items-center gap-1'>
          Saiba mais na
          <span className='text-blue-600 hover:underline'>
            <Link href={docsUrl} target='_blank' className='flex items-center gap-1'>
              documentação da API
              <SquareArrowOutUpRightIcon className='size-4' />
            </Link>
          </span>
        </p>
      }
      description='Use a chave de API para autenticar as requisições da SDK instalada no seu app.'
    >
      <ApiKeyField apiKey={apiKey?.key || ''} />
    </SettingsField>
  )
}
