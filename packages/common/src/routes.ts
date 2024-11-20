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
  SETTINGS_SDK: {
    path: (team: string, app: string) => `/${team}/${app}/settings/sdk`,
  },
  SETTINGS_DOMAINS: {
    path: (team: string, app: string) => `/${team}/${app}/settings/domains`,
  },

  SIGN_IN: {
    path: '/sign-in',
  },
  IOS_PREVIEW: {
    path: '/ios/preview',
  },
}
