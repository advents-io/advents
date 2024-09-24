import { z } from 'zod'

export const sessionSchema = z.object({
  sdkName: z.string(),
  sdkVersion: z.string(),
  deviceTimestamp: z
    .string()
    .datetime()
    .transform(val => new Date(val)),
  os: z.string(),

  android: z
    .object({
      deviceId: z.string().nullable(),
      installReferrer: z.string().nullable(),
    })
    .nullable(),

  ios: z
    .object({
      clickId: z.string().nullable(),
    })
    .nullable(),

  installTime: z
    .string()
    .datetime()
    .nullable()
    .transform(val => (val ? new Date(val) : null)),

  deviceName: z.string().nullable(),
  deviceBrand: z.string().nullable(),
  deviceModel: z.string().nullable(),
  deviceYearClass: z.string().nullable(),
  osVersion: z.string().nullable(),
  appVersion: z.string().nullable(),
})

export type Session = z.infer<typeof sessionSchema>
