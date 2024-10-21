import { prisma } from '@advents/db'

import { ErrorAlert } from '@/components/error-alert'

import { ApiKeyField } from './api-key-field'

export default async function Sdk({ params }: { params: { app: string } }) {
  const apiKey = await prisma.apiKey.findFirst({
    where: {
      app: {
        slug: params.app,
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
    <div>
      <ApiKeyField apiKey={apiKey?.key || ''} />
    </div>
  )
}
