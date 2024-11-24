'use client'

import { FaApple as AppleIcon } from 'react-icons/fa'

import { Button } from '@/ui/button'

interface Props {
  clickId?: string
  redirect?: string
}

export const AppStoreRedirectButton = ({ clickId, redirect }: Props) => {
  const openAppStore = () => {
    if (clickId && redirect) {
      const copyUrl = `https://advents.io/click_id=${clickId}`

      navigator.clipboard.writeText(copyUrl)
      window.location.href = redirect
    }
  }

  return (
    <Button onClick={openAppStore} className='bg-blue-500 font-bold text-white hover:bg-blue-600'>
      <AppleIcon />
      Abrir na App Store
    </Button>
  )
}
