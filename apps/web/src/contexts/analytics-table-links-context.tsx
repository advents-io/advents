import { GetLinksAnalyticsOutput } from '@advents/queries/client'
import { createContext, ReactNode, useContext, useState } from 'react'

type EditLinkProps = Pick<
  GetLinksAnalyticsOutput[number],
  'id' | 'slug' | 'title' | 'domain' | 'campaignCost'
>

interface AnalyticsTableLinksContextData {
  links: GetLinksAnalyticsOutput
  setLinks: (links: GetLinksAnalyticsOutput) => void
  editLink: (link: EditLinkProps) => void
  removeLink: (linkId: string) => void
}

const AnalyticsTableLinksContext = createContext({} as AnalyticsTableLinksContextData)

export const AnalyticsTableLinksProvider = ({ children }: { children: ReactNode }) => {
  const [links, setLinks] = useState<GetLinksAnalyticsOutput>([])

  const editLink = (link: EditLinkProps) =>
    setLinks(prevLinks =>
      prevLinks.map(prevLink =>
        prevLink.id === link.id
          ? {
              ...prevLink,
              ...link,
            }
          : prevLink,
      ),
    )

  const removeLink = (linkId: string) =>
    setLinks(prevLinks => prevLinks.filter(prevLink => prevLink.id !== linkId))

  return (
    <AnalyticsTableLinksContext.Provider
      value={{
        links,
        setLinks,
        editLink,
        removeLink,
      }}
    >
      {children}
    </AnalyticsTableLinksContext.Provider>
  )
}

export const useAnalyticsTableLinks = (): AnalyticsTableLinksContextData => {
  const context = useContext(AnalyticsTableLinksContext)

  return context || {}
}
