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

  SIGN_IN: {
    path: '/sign-in',
  },
  IOS_CLICK: {
    path: '/ios/click',
  },
}
