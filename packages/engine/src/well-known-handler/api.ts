import { prisma } from '@advents/db'
import { Hono } from 'hono'

import { getRequestDomain } from '../utils/domain'

export const wellKnownHandlerApi = new Hono({
  strict: false,
}).basePath('/.well-known')

wellKnownHandlerApi.get(
  '/apple-app-site-association', //
  async c => {
    const domain = getRequestDomain(c.req.raw)
    const subDomain = domain.includes('.') ? domain.split('.')[0] : null

    if (!subDomain) {
      return c.json({ error: 'Domínio inválido.' }, 400)
    }

    const app = await prisma.app.findFirst({
      where: {
        subDomain,
      },
      select: {
        enableIosUniversalLinks: true,
        appleTeamId: true,
        iosBundleIds: {
          select: {
            bundleId: true,
          },
        },
      },
    })

    if (!app) {
      return c.json({ error: 'Domínio inválido.' }, 400)
    }

    if (!app.enableIosUniversalLinks) {
      return c.json({ error: 'iOS Universal Links desabilitado para esse app.' }, 404)
    }

    if (!app.appleTeamId || app.iosBundleIds.length === 0) {
      return c.json({ error: 'Configuração do iOS Universal Links inválida.' }, 404)
    }

    const result = {
      applinks: {
        apps: [],
        details: app.iosBundleIds.map(({ bundleId }) => ({
          appID: `${app.appleTeamId}.${bundleId}`,
          paths: ['*/'],
        })),
      },
      activitycontinuation: {
        apps: app.iosBundleIds.map(({ bundleId }) => `${app.appleTeamId}.${bundleId}`),
      },
      webcredentials: {
        apps: app.iosBundleIds.map(({ bundleId }) => `${app.appleTeamId}.${bundleId}`),
      },
    }

    return c.json(result)
  },
)

wellKnownHandlerApi.get(
  '/assetlinks.json', //
  async c => {
    const domain = getRequestDomain(c.req.raw)
    const subDomain = domain.includes('.') ? domain.split('.')[0] : null

    if (!subDomain) {
      return c.json({ error: 'Domínio inválido.' }, 400)
    }

    const app = await prisma.app.findFirst({
      where: {
        subDomain,
      },
      select: {
        enableAndroidAppLinks: true,
        androidPackageName: true,
        androidCertFingerprints: {
          select: {
            sha256Fingerprint: true,
          },
        },
      },
    })

    if (!app) {
      return c.json({ error: 'Domínio inválido.' }, 400)
    }

    if (!app.enableAndroidAppLinks) {
      return c.json({ error: 'Android App Links desabilitado para esse app.' }, 404)
    }

    if (app.androidCertFingerprints.length === 0) {
      return c.json({ error: 'Configuração do Android App Links inválida.' }, 404)
    }

    const result = [
      {
        relation: ['delegate_permission/common.handle_all_urls'],
        target: {
          namespace: 'android_app',
          package_name: app.androidPackageName,
          sha256_cert_fingerprints: app.androidCertFingerprints.map(
            ({ sha256Fingerprint }) => sha256Fingerprint,
          ),
        },
      },
    ]

    return c.json(result)
  },
)
