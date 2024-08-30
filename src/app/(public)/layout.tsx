import { PublicHeader } from '@/components/public-header'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicHeader />
      <div className='flex max-w-7xl flex-1 flex-col items-center justify-center'>{children}</div>
    </>
  )
}
