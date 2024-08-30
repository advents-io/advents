import { Loader2 } from 'lucide-react'

interface Props {
  children: React.ReactNode
  loading: boolean
}

export const LoadingContent = ({ children, loading }: Props) => {
  return (
    <div data-loading={loading} className='flex items-center gap-2 px-3 data-[loading=true]:px-0'>
      {loading && <Loader2 className='h-4 w-4 animate-spin' />}
      {children}
    </div>
  )
}
