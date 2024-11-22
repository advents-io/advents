export const routes = {
  TEAMS: {
    path: '/',
  },
  APPS: {
    path: (team: string) => `/${team}`,
  },
  APPS_NEW: {
    path: (team: string) => `/${team}/new`,
  },
  LINKS: {
    path: (team: string, app: string) => `/${team}/${app}`,
  },
  ANALYTICS: {
    path: (team: string, app: string) => `/${team}/${app}/analytics`,
  },
  SETTINGS: {
    path: (team: string, app: string) => `/${team}/${app}/settings`,
  },
  SETTINGS_DOMAINS: {
    path: (team: string, app: string) => `/${team}/${app}/settings/domains`,
  },
  SETTINGS_QRCODE: {
    path: (team: string, app: string) => `/${team}/${app}/settings/qrcode`,
  },
  SETTINGS_SDK: {
    path: (team: string, app: string) => `/${team}/${app}/settings/sdk`,
  },

  SIGN_IN: {
    path: '/sign-in',
  },
  IOS_PREVIEW: {
    path: '/ios/preview',
  },
}

export const settingsRoutes = (team: string, app: string) => [
  routes.SETTINGS.path(team, app),
  routes.SETTINGS_DOMAINS.path(team, app),
  routes.SETTINGS_QRCODE.path(team, app),
  routes.SETTINGS_SDK.path(team, app),
]
