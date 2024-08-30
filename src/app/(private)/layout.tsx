import { PrivateHeader } from '@/components/private-header'

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PrivateHeader />
      {children}
    </>
  )
}
