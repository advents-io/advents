import { Loader2 } from 'lucide-react'

interface Props {
  children: React.ReactNode
  loading: boolean
}

export const LoadingSpinner = ({ children, loading }: Props) => {
  return (
    <div className='relative'>
      <div
        data-loading={loading}
        className='flex items-center gap-2 opacity-100 data-[loading=true]:opacity-0'
      >
        {children}
      </div>
      {loading && (
        <div className='absolute inset-0 flex items-center justify-center'>
          <Loader2 className='h-4 w-4 animate-spin' />
        </div>
      )}
    </div>
  )
}
