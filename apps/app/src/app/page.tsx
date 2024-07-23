import { LinkItem } from '@/components/link-item'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'

export default async function Home() {
  const links = await prisma.link.findMany()

  return (
    <main className='flex flex-1 flex-col p-8 md:p-14'>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-xl font-bold'>Links</h1>

        <Button variant='default' size='sm'>
          Create link
        </Button>
      </div>

      <div className='space-y-4'>
        {links.map(link => (
          <LinkItem key={link.id} link={link} />
        ))}
      </div>

      <p className='mt-4 text-sm text-muted-foreground'>
        Showing 1 - {links.length} of {links.length} links
      </p>
    </main>
  )
}
