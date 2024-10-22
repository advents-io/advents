import { Metadata } from 'next'

import { SettingsLayout as SettingsLayoutComponent } from './settings-layout'

export const metadata: Metadata = {
  title: 'Ajustes | Advents',
}

export default async function SettingsLayout(props: {
  children: React.ReactNode
  params: Promise<{ team: string; app: string }>
}) {
  const params = await props.params

  const { children } = props

  return (
    <SettingsLayoutComponent team={params.team} app={params.app}>
      {children}
    </SettingsLayoutComponent>
  )
}
