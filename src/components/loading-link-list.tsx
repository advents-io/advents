import { Loader2 } from 'lucide-react'

export const LoadingLinkList = () => {
  return (
    <div className='flex flex-1 items-center justify-center gap-2'>
      <Loader2 className='size-6 animate-spin' />
      Carregando...
    </div>
  )
}
