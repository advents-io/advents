import { AttributionMethod } from '@advents/db'

export interface AttributionData {
  method: AttributionMethod
  linkId: string
  clickId: string
  probabilisticConfidence: number | null
}
