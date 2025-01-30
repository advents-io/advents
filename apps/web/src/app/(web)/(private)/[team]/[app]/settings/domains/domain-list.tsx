import { Domain } from '@advents/queries/server'

import { cn } from '@/lib/tailwind'
import { Badge } from '@/ui/badge'
import { Card, CardHeader } from '@/ui/card'

import { DomainItemMoreOptionsButton } from './domain-item-more-options-button'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  domains: Domain[]
}

export const DomainList = ({ domains, className }: Props) => {
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
