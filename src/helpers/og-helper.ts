import { ActionError } from '@/actions/safe-action'

export const fetchUrlOgImage = async (url: string) => {
  const response = await fetch(url)
  const html = await response.text()

  const ogImageMatch = html.match(/<meta property="og:image" content="(.*?)">/)

  if (!ogImageMatch || !ogImageMatch[1]) {
    throw new ActionError('Imagem do app não encontrada.')
  }

  return ogImageMatch[1]
}
