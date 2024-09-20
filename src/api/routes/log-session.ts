import { zValidator } from '@hono/zod-validator'
import { waitUntil } from '@vercel/functions'
import { Hono } from 'hono'
import { userAgent } from 'next/server'
import { z } from 'zod'

import { authMiddleware } from '@/api/auth-middleware'
import { getGeoData } from '@/helpers/request-helper'
import { prisma } from '@/lib/prisma'

const sessionSchema = z.object({
  sdkName: z.string(),
  sdkVersion: z.string(),
  os: z.string(),
  deviceTimestamp: z
    .string()
    .datetime()
    .transform(val => new Date(val)),

  androidId: z.string().nullable(),
  androidInstallReferrer: z.string().nullable(),
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

type Session = z.infer<typeof sessionSchema>

export const logSession = (api: Hono) =>
  api.post(
    '/sessions', //
    authMiddleware, //
    zValidator('json', sessionSchema), //
    async c => {
      const session = c.req.valid('json')

      const appId = c.var.appId

      const ua = userAgent(c.req.raw)

      const geoData = getGeoData(c.req.raw)

      const { id: sessionId } = await prisma.session.create({
        data: {
          ...session,
          userAgent: ua.ua || 'Unknown',
          ...geoData,
          appId,
        },
        select: {
          id: true,
        },
      })

      waitUntil(checkInstall(sessionId, session))

      return new Response()
    },
  )

interface InstallData {
  isNewInstall: boolean
  linkId?: string
}

const checkInstall = async (sessionId: string, session: Session) => {
  let installData: InstallData | undefined

  if (session.os === 'android') {
    installData = await checkAndroidInstall(sessionId, session)
  }

  if (session.os === 'ios') {
    installData = await checkIosInstall(sessionId, session)
  }

  if (installData && installData.isNewInstall && installData.linkId) {
    await prisma.link.update({
      where: {
        id: installData.linkId,
      },
      data: {
        installs: {
          increment: 1,
        },
      },
    })
  }
}

const checkAndroidInstall = async (sessionId: string, session: Session): Promise<InstallData> => {
  const referrer = session.androidInstallReferrer

  if (!referrer || !referrer.includes('advents_click_id')) {
    return {
      isNewInstall: false,
    }
  }

  const [, clickId] = referrer.split('advents_click_id=')

  if (!clickId) {
    return {
      isNewInstall: false,
    }
  }

  const click = await prisma.click.findUnique({
    where: {
      id: clickId,
    },
    select: {
      id: true,
      linkId: true,
    },
  })

  if (!click) {
    return {
      isNewInstall: false,
    }
  }

  const hasInstall = await prisma.install.findUnique({
    where: {
      clickId,
    },
    select: {
      id: true,
    },
  })

  if (hasInstall) {
    return {
      isNewInstall: false,
    }
  }

  await prisma.install.create({
    data: {
      clickId: click.id,
      sessionId,
    },
  })

  return {
    isNewInstall: true,
    linkId: click.linkId,
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const checkIosInstall = async (sessionId: string, session: Session): Promise<InstallData> => {
  // TODO: implement

  return {
    isNewInstall: false,
  }
}
