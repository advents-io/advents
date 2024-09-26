import { prisma } from '@advents/db'

import { ApiKeyField } from '@/components/api-key-field'
import { ErrorAlert } from '@/components/error-alert'

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
