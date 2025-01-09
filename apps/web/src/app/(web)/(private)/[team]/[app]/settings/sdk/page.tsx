import { DOCS_URLS } from '@advents/common'
import { prisma } from '@advents/db'
import { SquareArrowOutUpRightIcon } from 'lucide-react'
import Link from 'next/link'

import { ErrorAlert } from '@/components/error-alert'
import { SettingsField } from '@/components/settings-field'

import { ApiKeyField } from './api-key-field'

export default async function Page(props: { params: Promise<{ team: string; app: string }> }) {
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

  return (
    <SettingsField
      fieldState={undefined}
      title='Chave da API'
      footerLabel={
        <span>
          Saiba mais na{' '}
          <Link
            href={DOCS_URLS.API_KEY}
            target='_blank'
            className='inline-flex items-center whitespace-pre text-blue-600 hover:underline'
          >
            documentação da API. <SquareArrowOutUpRightIcon className='size-4' />
          </Link>
        </span>
      }
    >
      <p>Use a chave de API para autenticar as requisições da SDK instalada no seu app.</p>

      <ApiKeyField apiKey={apiKey?.key || ''} />
    </SettingsField>
  )
}
