/**
 * WORKAROUND: Remove the supabase console warning from using auth.getSession()
 */
export const removeSupabaseConsoleWarn = () => {
  const originalConsoleWarn = console.warn

  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Using the user object as returned from supabase.auth')
    ) {
      return
    }

    originalConsoleWarn.apply(console, args)
  }
}
