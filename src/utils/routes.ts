export const routes = {
  TEAMS: {
    path: '/',
  },
  APPS: {
    path: (team: string) => `/${team}`,
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

  SIGN_IN: {
    path: '/sign-in',
  },
}

export function isProtectedRoute(path: string) {
  const notProtectedRoutes = [routes.SIGN_IN.path]

  return !notProtectedRoutes.includes(path)
}
