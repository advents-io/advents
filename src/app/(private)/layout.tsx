import { Header } from '@/components/header'

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
