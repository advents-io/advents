export const isStoreUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url)

    const storeUrls = ['apps.apple.com', 'itunes.apple.com', 'play.google.com']

    const isStoreUrl = storeUrls.some(storeUrl => urlObj.hostname.includes(storeUrl))
    return isStoreUrl
  } catch {
    return false
  }
}

export const normalizeStoreUrl = (url: string): string | null => {
  try {
    if (!isStoreUrl(url)) {
      return null
    }

    const urlObj = new URL(url)

    const isIos =
      urlObj.hostname.includes('apps.apple.com') || urlObj.hostname.includes('itunes.apple.com')
    const isAndroid = urlObj.hostname.includes('play.google.com')

    if (isIos) {
      const appId = urlObj.pathname.match(/id(\d+)/)

      if (!appId) {
        return null
      }

      return `https://apps.apple.com/app/id${appId[1]}`
    }

    if (isAndroid) {
      const packageSearchParam = urlObj.searchParams.get('id')

      if (!packageSearchParam) {
        return null
      }

      return `https://play.google.com/store/apps/details?id=${packageSearchParam}`
    }

    return null
  } catch {
    return null
  }
}

export const getAndroidPackageNameFromStoreUrl = (url: string): string | null => {
  const normalizedUrl = normalizeStoreUrl(url)

  if (!normalizedUrl) {
    return null
  }

  const urlObj = new URL(normalizedUrl)
  const packageSearchParam = urlObj.searchParams.get('id')

  if (!packageSearchParam) {
    return null
  }

  return packageSearchParam
}
