import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ajustes | Advents',
}

export default async function Settings() {
  return (
    <div className='flex flex-1 items-center justify-center'>
      <h1>Settings</h1>
    </div>
  )
}
