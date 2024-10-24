import { GetLinksAnalyticsOutput } from '@advents/queries'
import { createContext, ReactNode, useContext, useState } from 'react'

type EditLinkProps = Pick<GetLinksAnalyticsOutput[number], 'id' | 'slug' | 'title' | 'domain'>

interface AnalyticsTableLinksContextData {
  links: GetLinksAnalyticsOutput
  setLinks: (links: GetLinksAnalyticsOutput) => void
  editLink: (link: EditLinkProps) => void
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

  return (
    <AnalyticsTableLinksContext.Provider
      value={{
        links,
        setLinks,
        editLink,
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
