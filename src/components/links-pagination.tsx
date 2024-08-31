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

  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  const addPage = (add: number) => {
    const newPage = page + add

    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('page', newPage.toString())
    replace(`${pathname}?${newSearchParams.toString()}`)
  }

  return (
    <div className='mt-4 flex items-center'>
      <div className='flex-1'>
        <p className='text-sm text-muted-foreground'>
          Exibindo {start} - {end} de {total} links
        </p>
      </div>

      <div className='flex gap-2'>
        <Button size='sm' variant='secondary' disabled={page === 1} onClick={() => addPage(-1)}>
          <ChevronLeft className='mr-1 size-3' />
          Anterior
        </Button>

        <Button
          size='sm'
          variant='secondary'
          disabled={page === totalPages}
          onClick={() => addPage(1)}
        >
          Próximo
          <ChevronRight className='ml-1 size-3' />
        </Button>
      </div>
    </div>
  )
}
