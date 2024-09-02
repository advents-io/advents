'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/ui/button'

interface Props {
  page: number
  pageSize: number
  total: number
}

export const LinksPagination = ({ page, pageSize, total }: Props) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const totalPages = total > 0 ? Math.ceil(total / pageSize) : 1
  const start = total > 0 ? (page - 1) * pageSize + 1 : 0
  const end = Math.min(page * pageSize, total)

  const addPage = (add: number) => {
    const newPage = page + add

    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('page', newPage.toString())
    replace(`${pathname}?${newSearchParams.toString()}`)
  }

  return (
    <div className='mt-4 flex items-center gap-2'>
      <div className='flex-1'>
        <p className='text-sm text-muted-foreground'>
          Exibindo {start} - {end} de {total} links
        </p>
      </div>

      <div className='flex gap-2'>
        <Button size='sm' variant='secondary' disabled={page === 1} onClick={() => addPage(-1)}>
          <ChevronLeft className='size-5 sm:size-3' />
          <span className='ml-1 hidden sm:flex'>Anterior</span>
        </Button>

        <Button
          size='sm'
          variant='secondary'
          disabled={page === totalPages}
          onClick={() => addPage(1)}
        >
          <span className='mr-1 hidden sm:flex'>Próximo</span>
          <ChevronRight className='size-5 sm:size-3' />
        </Button>
      </div>
    </div>
  )
}
