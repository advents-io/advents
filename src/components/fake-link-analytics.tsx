import { Download, Loader2, MousePointerClick } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Badge } from '@/ui/badge'
import { Routes } from '@/utils/routes'

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
      <Link href={Routes['/analytics']} className='hidden sm:flex'>
        <Badge variant='secondary' className='min-w-20 justify-center gap-2 py-1 font-normal'>
          {mounted ? (
            <>
              <MousePointerClick className='h-4 w-4' />
              {clicks} clicks
            </>
          ) : (
            <Loader2 className='h-4 w-4 animate-spin' />
          )}
        </Badge>
      </Link>

      <Link href={Routes['/analytics']} className='hidden sm:flex'>
        <Badge variant='secondary' className='min-w-20 justify-center gap-2 py-1 font-normal'>
          {mounted ? (
            <>
              <Download className='h-4 w-4' />
              {installs} instalações
            </>
          ) : (
            <Loader2 className='h-4 w-4 animate-spin' />
          )}
        </Badge>
      </Link>
    </>
  )
}
