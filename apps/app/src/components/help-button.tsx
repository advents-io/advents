import { ContactDropdown } from '@/components/contact-dropdown'
import { Button } from '@/ui/button'

export const HelpButton = () => {
  return (
    <ContactDropdown modal={false} align='end'>
      <Button
        variant='outline'
        className='fixed bottom-6 right-4 h-10 w-10 rounded-full p-0 text-2xl font-light shadow-md focus:ring-0 focus:ring-offset-0'
      >
        ?
      </Button>
    </ContactDropdown>
  )
}
