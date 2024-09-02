import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/tailwind'
import { Button } from '@/ui/button'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  href: string
}

export const HeaderItem = ({ children, href, className, ...props }: Props) => {
  const pathname = usePathname()

  const isActive = pathname === href

  return (
    <Link href={href}>
      <Button
        className={cn('font-normal text-muted-foreground', className)}
        variant='ghost'
        size='sm'
        {...props}
      >
        {children}
      </Button>

      <div
        data-isactive={isActive}
        className='mt-1 hidden h-0.5 w-full bg-black data-[isactive=true]:flex'
      />
    </Link>
  )
}
