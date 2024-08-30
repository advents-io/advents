import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  href?: string
}

export const HeaderItem = ({ children, href, ...props }: Props) => {
  const pathname = usePathname()

  const isActive = pathname === href

  return (
    <button
      data-isactive={isActive}
      className='flex items-center text-left text-lg font-medium data-[isactive=true]:font-bold md:text-sm'
      {...props}
    >
      {href ? <Link href={href}>{children}</Link> : children}
    </button>
  )
}
