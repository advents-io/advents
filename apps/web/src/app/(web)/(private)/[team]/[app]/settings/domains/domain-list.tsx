import { prisma } from '@advents/db'
import { getAppDomains } from '@advents/queries/server'
import { getSessionUser } from '@advents/supabase/server'

import { cn } from '@/lib/tailwind'
import { Badge } from '@/ui/badge'
import { Card, CardHeader } from '@/ui/card'
import { Skeleton } from '@/ui/skeleton'

import { DomainItemMoreOptionsButton } from './domain-item-more-options-button'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  teamSlug: string
  appSlug: string
}

export const DomainList = async ({ teamSlug, appSlug, className }: Props) => {
  const user = await getSessionUser()

  if (!user) {
    return null
  }

  const app = await prisma.app.findFirst({
    where: {
      slug: appSlug,
      team: {
        slug: teamSlug,
        members: {
          some: {
            userId: user.id,
          },
        },
      },
    },
    select: {
      id: true,
    },
  })

  if (!app) {
    return null
  }

  const domains = await getAppDomains(app.id)

  return (
    <div className={cn('space-y-2', className)}>
      {domains.map((domain, index) => (
        <Card key={index}>
          <CardHeader>
            <div className='flex min-h-10 items-center gap-4'>
              <span className='truncate font-mono font-semibold'>{domain.domain}</span>

              <Badge
                variant={domain.type === 'custom' ? 'default' : 'outline'}
                className={cn(domain.type === 'custom' && 'bg-blue-600 hover:bg-blue-600/80')}
              >
                {domain.type === 'custom' ? 'Customizado' : 'Padrão'}
              </Badge>

              {domain.type === 'custom' && (
                <DomainItemMoreOptionsButton domain={domain.domain} className='ml-auto' />
              )}
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}

export const DomainListSkeleton = () => {
  return (
    <div className='space-y-2'>
      {Array.from({ length: 10 }).map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <div className='flex min-h-10 flex-row items-center gap-4'>
              <Skeleton className='h-6 w-32' />
              <Skeleton className='h-6 w-20' />
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
