'use client'

import { DOCS_URL, routes } from '@advents/common'
import { App } from '@advents/db'
import { supabaseClient } from '@advents/supabase/client'
import { MoveUpRightIcon, SlashIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

import AdventsLogo from '@/assets/advents/logo.svg'
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
  apps: Pick<App, 'id' | 'name' | 'slug' | 'imageUrl'>[]
}

export const PrivateHeader = ({ email, apps }: Props) => {
  const { app, team } = useParams<{ team: string; app: string }>()
  const router = useRouter()

  const signOut = () => {
    const supabase = supabaseClient()
    supabase.auth.signOut()
    router.push(routes.SIGN_IN.path)
  }

  const includeTabs = !!team && !!app

  return (
    <header className='sticky -top-18 z-10 w-full border-b bg-background px-4 md:px-8'>
      <div className='flex py-4'>
        <div className='flex flex-1 flex-row items-center'>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className='hidden md:flex'>
                <BreadcrumbLink href={routes.TEAMS.path}>
                  <Image src={AdventsLogo} alt='Logo da Advents' className='w-6' />
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator className='hidden md:flex'>
                <SlashIcon className='text-gray-300' />
              </BreadcrumbSeparator>

              <BreadcrumbItem>
                <AppSelector apps={apps} />
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

          <Link href={DOCS_URL} target='_blank' className='hidden md:flex'>
            <Button variant='ghost' size='sm' className='font-normal text-muted-foreground'>
              Documentação
              <MoveUpRightIcon />
            </Button>
          </Link>

          <UserButton email={email} signOut={signOut} />
        </div>
      </div>

      {includeTabs && (
        <nav className='flex gap-4 pt-2'>
          <HeaderItem href={[routes.LINKS.path(team, app)]}>Links</HeaderItem>
          <HeaderItem href={[routes.ANALYTICS.path(team, app)]}>Analytics</HeaderItem>
          <HeaderItem
            href={[
              routes.SETTINGS.path(team, app),
              routes.SETTINGS_SDK.path(team, app),
              routes.SETTINGS_DOMAINS.path(team, app),
            ]}
          >
            Ajustes
          </HeaderItem>
        </nav>
      )}
    </header>
  )
}
