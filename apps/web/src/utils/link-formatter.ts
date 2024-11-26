export const formatShortLink = (domain: string, slug: string, https = false) => {
  return https ? `https://${domain}/${slug}` : `${domain}/${slug}`
}
