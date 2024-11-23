import { Suspense } from 'react'

import { EditAppQrcodeLogoForm } from './edit-app-qrcode-logo-form'
import Loading from './loading'

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <EditAppQrcodeLogoForm />
    </Suspense>
  )
}
