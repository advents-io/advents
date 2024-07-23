import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'

interface Props extends LinkProps {
  children: React.ReactNode
}

export const NavigationItem = ({ children, ...props }: Props) => {
  const pathname = usePathname()

  const isActive = pathname === props.href

  return (
    <Link
      data-isactive={isActive}
      className='text-lg font-medium data-[isactive=true]:font-bold md:text-sm'
      {...props}
    >
      {children}
    </Link>
  )
}
