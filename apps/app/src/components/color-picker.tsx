import { CheckIcon } from 'lucide-react'
import { HexColorInput, HexColorPicker } from 'react-colorful'

import { cn } from '@/lib/tailwind'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip'

const DEFAULT_COLORS = [
  '#000000',
  '#FFFFFF',
  '#C73E33',
  '#DF6547',
  '#F4B3D7',
  '#F6CF54',
  '#49A065',
  '#2146B7',
]

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  selectedColor?: string
  setSelectedColor: (color: string) => void
}

export const ColorPicker = ({
  selectedColor: inputSelectedColor = '#000000',
  setSelectedColor,
  className,
}: Props) => {
  const selectedColor = inputSelectedColor.toUpperCase()

  const handleSetSelectedColor = (color: string) => setSelectedColor(color.toUpperCase())

  return (
    <div className={cn('flex gap-6', className)}>
      <div className='relative flex h-9 w-32 shrink-0 rounded-md shadow-md'>
        <Tooltip>
          <TooltipTrigger>
            <div
              className='h-full w-10 rounded-l-md border'
              style={{
                backgroundColor: selectedColor,
                borderColor: selectedColor,
              }}
            />
          </TooltipTrigger>

          <TooltipContent>
            <div className='flex max-w-xs flex-col items-center space-y-3 p-5 text-center'>
              <HexColorPicker color={selectedColor} onChange={handleSetSelectedColor} />
            </div>
          </TooltipContent>
        </Tooltip>

        <HexColorInput
          color={selectedColor}
          onChange={handleSetSelectedColor}
          prefixed
          style={{ borderColor: selectedColor }}
          className='w-full rounded-r-md border-2 border-l-0 pl-3 placeholder-gray-400 focus:outline-none focus:ring-black sm:text-sm'
        />
      </div>

      <div className='flex flex-wrap items-center gap-3'>
        {DEFAULT_COLORS.map(color => {
          const isSelected = selectedColor.toUpperCase() === color.toUpperCase()

          return (
            <button
              key={color}
              type='button'
              onClick={() => handleSetSelectedColor(color)}
              className={cn(
                'flex size-7 items-center justify-center rounded-full ring-1 ring-gray-300 transition-all hover:ring-gray-200',
                isSelected ? 'ring-black ring-offset-[3px]' : 'hover:ring-4',
              )}
              style={{ backgroundColor: color }}
            >
              {isSelected && (
                <CheckIcon
                  className={cn(
                    'size-4',
                    color.toUpperCase() === '#FFFFFF' ? 'text-black' : 'text-white',
                  )}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
