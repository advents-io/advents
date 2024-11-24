import { Suspense } from 'react'

import { EditAppQrCodeLogoForm } from './edit-app-qrcode-logo-form'
import Loading from './loading'

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <EditAppQrCodeLogoForm />
    </Suspense>
  )
}
