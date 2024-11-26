'use client'

import { dayjs } from '@advents/common'
import { CalendarIcon, ChevronDownIcon } from 'lucide-react'
import * as React from 'react'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'

import { cn } from '@/lib/tailwind'
import { Button } from '@/ui/button'
import { Calendar } from '@/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover'

import { useStartEndDate } from './use-start-end-date'

export const DatePicker = () => {
  const [{ startDate, endDate }, setStartEndDate] = useStartEndDate()

  const [range, setRange] = useState<DateRange | undefined>({
    from: dayjs(startDate).toDate(),
    to: dayjs(endDate).toDate(),
  })

  const [open, setOpen] = useState(false)

  const applyDateChanges = () => {
    if (!range) {
      return
    }

    setStartEndDate({
      startDate: dayjs(range.from).format('YYYY-MM-DD'),
      endDate: dayjs(range.to).format('YYYY-MM-DD'),
    })

    setOpen(false)
  }

  const handleOnOpenChange = (open: boolean) => {
    if (open) {
      setRange({
        from: dayjs(startDate).toDate(),
        to: dayjs(endDate).toDate(),
      })
    }

    setOpen(open)
  }

  return (
    <Popover open={open} onOpenChange={handleOnOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn('justify-between text-left font-normal md:w-[250px]')}
        >
          <div className='flex items-center'>
            <CalendarIcon className='mr-2 size-4' />

            {startDate && endDate ? (
              <>
                {dayjs(startDate).format('DD MMM YY')} - {dayjs(endDate).format('DD MMM YY')}
              </>
            ) : (
              <span>Selecione uma data</span>
            )}
          </div>

          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          initialFocus
          showOutsideDays={false}
          mode='range'
          defaultMonth={dayjs(range?.to).add(-1, 'month').toDate()}
          selected={range}
          onSelect={setRange}
          numberOfMonths={2}
          toDate={dayjs().toDate()}
        />

        <div className='flex justify-end p-2'>
          <Button onClick={applyDateChanges} size='sm' disabled={!range}>
            Aplicar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
