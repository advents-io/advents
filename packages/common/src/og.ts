export const getUrlOgImage = async (url: string) => {
  let image: string | null = null

  try {
    const response = await fetch(url)
    const html = await response.text()

    const ogImageMatch = html.match(/<meta property="og:image" content="(.*?)">/)

    if (ogImageMatch && ogImageMatch[1]) {
      image = ogImageMatch[1]
    }
  } catch {}

  return image
}
