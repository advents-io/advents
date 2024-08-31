import { Download, MousePointerClick } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { LoadingSpinner } from '@/components/loading-spinner'
import { Badge } from '@/ui/badge'
import { routes } from '@/utils/routes'

export const FakeLinkAnalytics = () => {
  const [mounted, setMounted] = useState(false)
  const [clicks, setClicks] = useState(0)
  const [installs, setInstalls] = useState(0)

  useEffect(() => {
    if (clicks === 0) {
      const randomClicks = Math.floor(Math.random() * (10000 - 50 + 1)) + 50
      setClicks(randomClicks)
      setInstalls(Math.floor(Math.random() * (randomClicks - 1)) + 1)
    }

    setTimeout(() => {
      setMounted(true)
    }, 800)
  }, [clicks])

  return (
    <>
      <Link href={routes.ANALYTICS.path} className='hidden sm:flex'>
        <Badge variant='secondary' className='py-1 font-normal'>
          <LoadingSpinner loading={!mounted}>
            <MousePointerClick className='size-4' />
            {clicks} clicks
          </LoadingSpinner>
        </Badge>
      </Link>

      <Link href={routes.ANALYTICS.path} className='hidden sm:flex'>
        <Badge variant='secondary' className='py-1 font-normal'>
          <LoadingSpinner loading={!mounted}>
            <Download className='size-4' />
            {installs} instalações
          </LoadingSpinner>
        </Badge>
      </Link>
    </>
  )
}
