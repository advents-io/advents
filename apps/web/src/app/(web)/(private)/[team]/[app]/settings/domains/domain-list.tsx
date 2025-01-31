import { Domain } from '@advents/queries/server'
import { GlobeIcon } from 'lucide-react'

import { EmptyScreen, EmptyScreenDescription, EmptyScreenIcon } from '@/components/empty-screen'
import { cn } from '@/lib/tailwind'
import { Card, CardHeader } from '@/ui/card'

import { DomainItemMoreOptionsButton } from './domain-item-more-options-button'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  domains: Domain[]
}

export const DomainList = ({ domains, className }: Props) => {
  const filteredDomains = domains.filter(domain => domain.type === 'custom')

  if (filteredDomains.length === 0) {
    return (
      <div className='rounded-lg border py-10'>
        <EmptyScreen className='h-auto items-center'>
          <EmptyScreenIcon>
            <GlobeIcon />
          </EmptyScreenIcon>

          <EmptyScreenDescription>
            Adicione um domínio da sua empresa para colocar a sua marca personalizada nos links.
          </EmptyScreenDescription>
        </EmptyScreen>
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      {filteredDomains.map((domain, index) => (
        <Card key={index}>
          <CardHeader>
            <div className='flex min-h-10 items-center gap-4'>
              <span className='truncate font-mono font-semibold'>{domain.domain}</span>

              <DomainItemMoreOptionsButton domain={domain.domain} className='ml-auto' />
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
