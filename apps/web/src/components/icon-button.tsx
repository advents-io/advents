import { Loader2Icon } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/lib/tailwind'
import { Button } from '@/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip'

interface Props
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'>,
    Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  tooltip?: React.ReactNode
  isLoading?: boolean
  disabled?: boolean
  postClickIcon?: React.ReactNode
}

export const IconButton = ({
  tooltip,
  isLoading,
  disabled,
  postClickIcon,

  children,
  className,
  onClick,
}: Props) => {
  const [isPostClickInterval, setIsPostClickInterval] = useState(false)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (postClickIcon) {
      setIsPostClickInterval(true)
      setTimeout(() => setIsPostClickInterval(false), 2000)
    }

    onClick?.(event)
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={cn(
            'relative aspect-square size-8 text-muted-foreground disabled:pointer-events-auto disabled:cursor-not-allowed',
            (isPostClickInterval || isLoading) && 'pointer-events-none',
            className,
          )}
          variant='ghost'
          size='icon'
          type='button'
          onClick={handleClick}
          disabled={disabled}
        >
          <Loader2Icon
            className={cn(
              'absolute inset-0 m-auto size-4 animate-spin transition-all duration-500',
              isLoading ? 'opacity-100' : 'opacity-0',
            )}
          />

          {postClickIcon && (
            <div
              className={cn(
                'absolute inset-0 m-auto size-4 transition-all duration-500 [&_svg]:size-4',
                isPostClickInterval && !isLoading ? 'opacity-100' : 'opacity-0',
              )}
            >
              {postClickIcon}
            </div>
          )}

          <div
            className={cn(
              'transition-all duration-500',
              !isPostClickInterval && !isLoading ? 'opacity-100' : 'opacity-0',
            )}
          >
            {children}
          </div>
        </Button>
      </TooltipTrigger>

      {tooltip && <TooltipContent>{tooltip}</TooltipContent>}
    </Tooltip>
  )
}
