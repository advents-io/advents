import { createLink } from '@/actions/create-link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center gap-5'>
      Advents
      <form action={createLink}>
        <Button type='submit'>Click me</Button>
      </form>
    </main>
  )
}
