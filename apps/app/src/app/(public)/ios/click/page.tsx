import { prisma } from '@advents/db'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import { AppStoreRedirectButton } from './app-store-redirect-button'

export default async function IosClick(props: {
  searchParams: Promise<{ app_id?: string; click_id?: string; redirect?: string }>
}) {
  const { app_id: appId, click_id: clickId, redirect } = await props.searchParams

  if (!appId || !clickId || !redirect) {
    return notFound()
  }

  const app = await prisma.app.findUnique({
    where: {
      id: appId,
    },
    select: {
      name: true,
      imageUrl: true,
    },
  })

  return (
    <div className='relative mx-10 flex min-h-screen flex-col items-center justify-center'>
      {app && (
        <>
          <div className='mb-6'>
            <Image
              src={app.imageUrl}
              alt={`${app.name} logo`}
              width={100}
              height={100}
              className='rounded-3xl'
            />
          </div>

          <h1 className='mb-6 text-2xl font-bold'>{app?.name}</h1>
        </>
      )}

      <p className='mb-10 text-center text-gray-600'>
        Toque para abrir na App Store e instalar o aplicativo.
      </p>

      <AppStoreRedirectButton clickId={clickId} redirect={redirect} />

      <p className='absolute bottom-4 text-xs text-gray-500'>
        Fornecido por <b>Advents</b>
      </p>
    </div>
  )
}
