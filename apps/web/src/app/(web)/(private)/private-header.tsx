'use client'

import { DOCS_URLS, routes, settingsRoutes } from '@advents/common'
import { MoveUpRightIcon, SlashIcon } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { AdventsLogo } from '@/assets/advents-logo'
import { ContactButton } from '@/components/contact-button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/ui/breadcrumb'
import { Button } from '@/ui/button'

import { AppSelector } from './app-selector'
import { FeedbackButton } from './feedback-button'
import { HeaderItem } from './header-item'
import { UserButton } from './user-button'

interface Props {
  email?: string
  teams: {
    slug: string
    name: string
    apps: {
      id: string
      name: string
      slug: string
      imageUrl: string
    }[]
  }[]
}

export const PrivateHeader = ({ email, teams }: Props) => {
  const { team, app } = useParams<{ team: string; app: string }>()

  const includeTabs = !!team && !!app

  return (
    <header className='sticky -top-18 z-10 w-full border-b bg-background px-4 md:px-8'>
      <div className='flex py-4'>
        <div className='flex flex-1 flex-row items-center'>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className='hidden md:flex'>
                <BreadcrumbLink href={routes.TEAMS.path}>
                  <AdventsLogo className='size-6' />
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator className='hidden md:flex'>
                <SlashIcon className='text-gray-300' />
              </BreadcrumbSeparator>

              <BreadcrumbItem>
                <AppSelector teams={teams} />
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className='flex items-center gap-1'>
          <FeedbackButton />

          <ContactButton>
            <Button variant='ghost' size='sm' className='font-normal text-muted-foreground'>
              Ajuda
            </Button>
          </ContactButton>

          <Link href={DOCS_URLS.HOME} target='_blank' className='hidden md:flex'>
            <Button variant='ghost' size='sm' className='font-normal text-muted-foreground'>
              Documentação
              <MoveUpRightIcon />
            </Button>
          </Link>

          {email && <UserButton email={email} />}
        </div>
      </div>

      {includeTabs && (
        <nav className='flex gap-4 pt-2'>
          <HeaderItem href={[routes.LINKS.path(team, app)]}>Links</HeaderItem>
          <HeaderItem href={[routes.ANALYTICS.path(team, app)]}>Analytics</HeaderItem>
          <HeaderItem href={settingsRoutes(team, app)}>Ajustes</HeaderItem>
        </nav>
      )}
    </header>
  )
}
