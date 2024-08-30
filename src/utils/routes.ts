export const routes = {
  LINKS: {
    path: '/',
    protected: true,
  },
  ANALYTICS: {
    path: '/analytics',
    protected: true,
  },
  SETTINGS: {
    path: '/settings',
    protected: true,
  },
  RESET_PASSWORD: {
    path: '/reset-password',
    protected: true,
  },

  SIGN_IN: {
    path: '/sign-in',
    protected: false,
  },
  SIGN_UP: {
    path: '/sign-up',
    protected: false,
  },
  FORGOT_PASSWORD: {
    path: '/forgot-password',
    protected: false,
  },
}
