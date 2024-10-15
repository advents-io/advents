import { fetchUrlOgImage, LINK_DOMAINS } from '@advents/common'
import { supabaseAdminClient } from '@advents/supabase'

import { prisma } from '.'

const app = {
  name: 'Favorito',
  slug: 'favorito',
  defaultDomain: LINK_DOMAINS[0],
  androidUrl: 'https://play.google.com/store/apps/details?id=com.quebarbada.quebarbada',
  iosUrl: 'https://apps.apple.com/app/id1598991618',
  defaultFallbackUrl: 'https://favorito.digital',
  qrcodeLogoUrl: null,
}

async function seed() {
  const { team, user } = await createMember()
  const { appId } = await createApp({ teamId: team.id, userId: user.id })

  await createLinks(appId, user.id)
  await createAnalyticsData(appId)

  await grantAccessAndPrivileges()
  await createIncrementLinkClicksFunction()
}

const createLinks = async (appId: string, userId: string) => {
  const numLinks = Math.floor(Math.random() * 20) + 5 // 5 to 24 links

  for (let i = 0; i < numLinks; i++) {
    await prisma.link.create({
      data: {
        title: `Link ${i + 1}`,
        domain: app.defaultDomain,
        slug: `link-${i + 1}`,
        iosUrl: app.iosUrl,
        androidUrl: app.androidUrl,
        fallbackUrl: app.defaultFallbackUrl,
        appId,
        createdBy: userId,
        updatedBy: userId,
      },
    })
  }
}

const createAnalyticsData = async (appId: string) => {
  const links = await prisma.link.findMany({ where: { appId } })

  for (const link of links) {
    const numClicks = Math.floor(Math.random() * 1001) // 0 to 1000 clicks
    const numSessions = Math.floor(Math.random() * (numClicks + 1)) // 0 to numClicks sessions
    const numAttributions = Math.floor(Math.random() * (numSessions + 1)) // 0 to numSessions attributions

    // Create clicks
    await prisma.click.createMany({
      data: Array.from({ length: numClicks }, () => ({
        id: crypto.randomUUID(),
        destinationUrl: link.iosUrl,
        referer: '(direct)',
        refererUrl: '(direct)',
        isBot: false,
        linkId: link.id,
      })),
    })

    // Get the created clicks
    const clicks = await prisma.click.findMany({
      where: { linkId: link.id },
      select: { id: true },
      take: numAttributions,
    })

    const sessions = Array.from({ length: numSessions }, () => ({
      id: crypto.randomUUID(),
      appId,
    }))

    // Create sessions
    await prisma.session.createMany({
      data: sessions,
    })

    // Create attributions using the click IDs and session IDs
    await prisma.attribution.createMany({
      data: clicks.map((click, index) => ({
        method: 'ios_deterministic_click',
        clickId: click.id,
        sessionId: sessions[index].id,
      })),
    })

    // Increment click_count and install_count for the link
    await prisma.link.update({
      where: { id: link.id },
      data: {
        clickCount: numClicks,
        installCount: numAttributions,
      },
    })
  }
}

const createMember = async () => {
  const team = await prisma.team.create({
    data: {
      name: 'Favorito',
      slug: 'favorito',
    },
  })

  const {
    data: { users },
  } = await supabaseAdminClient().auth.admin.listUsers()

  if (!users.length) {
    throw new Error('No users found')
  }

  const user = users.find(user => user.email === 'gabriel@advents.io')

  if (!user) {
    throw new Error('User not found')
  }

  await prisma.member.create({
    data: {
      userId: user.id,
      teamId: team.id,
    },
  })

  return {
    team,
    user,
  }
}

const createApp = async ({ teamId, userId }: { teamId: string; userId: string }) => {
  const imageUrl = await fetchUrlOgImage(app.androidUrl)

  if (!imageUrl) {
    throw new Error('App image not found')
  }

  const apiKey = 'advents_NqL92oPEAbY1Qs3OHFx8NK9r' // API key used in example apps

  const { id: appId } = await prisma.app.create({
    data: {
      ...app,
      imageUrl,
      apiKeys: {
        create: {
          key: apiKey,
        },
      },
      teamId,
      createdBy: userId,
      updatedBy: userId,
    },
  })

  return { appId }
}

const grantAccessAndPrivileges = async () => {
  // Grant all privileges to anon, authenticated and service_role roles

  await prisma.$executeRaw`
    GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;`

  await prisma.$executeRaw`
    GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;`

  await prisma.$executeRaw`
    GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;`

  await prisma.$executeRaw`
    GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;`

  await prisma.$executeRaw`
    ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;`

  await prisma.$executeRaw`
    ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;`

  await prisma.$executeRaw`
    ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;`
}

const createIncrementLinkClicksFunction = async () => {
  await prisma.$executeRaw`
  CREATE OR REPLACE FUNCTION increment_link_clicks (link_id TEXT)
    RETURNS void
    AS $$
  BEGIN
    UPDATE
      links
    SET
      click_count = click_count + 1
    WHERE
      id = link_id;
  END;
  $$
  LANGUAGE plpgsql;`
}

seed()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
