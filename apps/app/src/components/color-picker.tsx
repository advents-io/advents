import { CheckIcon, XIcon } from 'lucide-react'
import { HexColorInput, HexColorPicker } from 'react-colorful'
import { useDebouncedCallback } from 'use-debounce'

import { cn } from '@/lib/tailwind'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip'

const getDefaultColors = (includeTransparent = false) => [
  {
    hex: '#000000',
    invertColor: '#FFFFFF',
  },
  {
    hex: '#FFFFFF',
    invertColor: '#000000',
  },
  {
    hex: '#C73E33',
    invertColor: '#FFFFFF',
  },
  {
    hex: '#F4B3D7',
    invertColor: '#000000',
  },
  {
    hex: '#2146B7',
    invertColor: '#FFFFFF',
  },
  {
    hex: '#F6CF54',
    invertColor: '#000000',
  },
  {
    hex: '#49A065',
    invertColor: '#FFFFFF',
  },
  ...(includeTransparent
    ? [
        {
          hex: 'transparent',
          invertColor: '#000000',
        },
      ]
    : []),
]

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  selectedColor?: string
  setSelectedColor: (color: string) => void
  includeTransparent?: boolean
}

export const ColorPicker = ({
  selectedColor: inputSelectedColor = '#000000',
  setSelectedColor,
  includeTransparent = false,
  className,
}: Props) => {
  const DEFAULT_COLORS = getDefaultColors(includeTransparent)

  const selectedColor = inputSelectedColor.toUpperCase()

  const onColorPickerChange = useDebouncedCallback(
    (color: string) => handleSetSelectedColor(color),
    500,
  )

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
              <HexColorPicker color={selectedColor} onChange={onColorPickerChange} />
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
        {DEFAULT_COLORS.map((color, index) => {
          const isSelected = selectedColor.toUpperCase() === color.hex.toUpperCase()
          const isTransparent = color.hex === 'transparent'

          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <button
                  type='button'
                  onClick={() => handleSetSelectedColor(color.hex)}
                  className={cn(
                    'flex size-7 items-center justify-center rounded-full ring-1 ring-gray-300 transition-all hover:ring-gray-200',
                    isSelected ? 'ring-black ring-offset-[3px]' : 'hover:ring-4',
                  )}
                  style={{ backgroundColor: color.hex }}
                >
                  {isSelected && !isTransparent && (
                    <CheckIcon className='size-4' style={{ color: color.invertColor }} />
                  )}

                  {isTransparent && <XIcon className='size-4 text-gray-400' />}
                </button>
              </TooltipTrigger>

              {isTransparent && <TooltipContent>Transparente</TooltipContent>}
            </Tooltip>
          )
        })}
      </div>
    </div>
  )
}
