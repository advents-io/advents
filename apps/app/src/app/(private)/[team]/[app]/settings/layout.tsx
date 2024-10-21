import { Metadata } from 'next'

import { SettingsLayout as SettingsLayoutComponent } from './settings-layout'

export const metadata: Metadata = {
  title: 'Ajustes | Advents',
}

export default function SettingsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { team: string; app: string }
}) {
  return (
    <SettingsLayoutComponent team={params.team} app={params.app}>
      {children}
    </SettingsLayoutComponent>
  )
}
