'use client'

import Image from 'next/image'

import AppleIcon from '@/assets/icons/apple.svg'
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
      <Image src={AppleIcon} alt='Apple Icon' className='mb-1 mr-2' width={20} height={20} />
      Abrir na App Store
    </Button>
  )
}
