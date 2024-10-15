'use client'

import { dayjs } from '@advents/common'
import { parseAsString, useQueryStates } from 'nuqs'

export const useStartEndDate = () => {
  return useQueryStates(
    {
      startDate: parseAsString.withDefault(dayjs().add(-6, 'days').format('YYYY-MM-DD')),
      endDate: parseAsString.withDefault(dayjs().format('YYYY-MM-DD')),
    },
    {
      urlKeys: {
        startDate: 'from',
        endDate: 'to',
      },
    },
  )
}
