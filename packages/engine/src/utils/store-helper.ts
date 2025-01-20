export const isStoreUrl = (url: string): boolean => {
  const storeUrls = ['apps.apple.com', 'play.google.com']
  const isStoreUrl = storeUrls.some(storeUrl => url.startsWith(storeUrl))
  return isStoreUrl
}
