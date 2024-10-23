import { fetchUrlOgImage, LINK_DOMAINS, nanoid } from '@advents/common'
import { supabaseServer } from '@advents/supabase'

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
  const { teamId, userId } = await createMember()
  const { appId } = await createApp(teamId, userId)

  await createLinks(appId, userId)
  await createAnalyticsData(appId)

  await grantAccessAndPrivileges()
  await createIncrementLinkClicksFunction()
}

const createLinks = async (appId: string, userId: string) => {
  const numLinks = Math.floor(Math.random() * 91) + 10 // 10 to 100 links

  for (let i = 0; i < numLinks; i++) {
    const createdAt = getRandomDateWithinLast90Days()

    await prisma.link.create({
      data: {
        title: `Link ${i + 1}`,
        domain: app.defaultDomain,
        slug: nanoid(),
        iosUrl: app.iosUrl,
        androidUrl: app.androidUrl,
        fallbackUrl: app.defaultFallbackUrl,
        appId,
        createdAt,
        updatedAt: createdAt,
        createdBy: userId,
        updatedBy: userId,
      },
    })
  }
}

const createAnalyticsData = async (appId: string) => {
  const links = await prisma.link.findMany({ where: { appId } })

  for (const link of links) {
    const numClicks = Math.floor(Math.random() * 10001) // 0 to 10000 clicks
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
        createdAt: getRandomDateWithinLast90Days(),
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
      createdAt: getRandomDateWithinLast90Days(),
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
        createdAt: getRandomDateWithinLast90Days(),
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
  const supabase = await supabaseServer(true)

  const {
    data: { users },
  } = await supabase.auth.admin.listUsers()

  if (!users.length) {
    throw new Error('No created users found.')
  }

  const adminUser = users.find(user => user.email === 'gabriel@advents.io')

  if (!adminUser) {
    throw new Error('Admin user not found.')
  }

  const team = await prisma.team.create({
    data: {
      name: 'Favorito',
      slug: 'favorito',
      createdBy: adminUser.id,
      updatedBy: adminUser.id,
    },
  })

  await prisma.member.create({
    data: {
      userId: adminUser.id,
      teamId: team.id,
      createdBy: adminUser.id,
      updatedBy: adminUser.id,
    },
  })

  return {
    teamId: team.id,
    userId: adminUser.id,
  }
}

const createApp = async (teamId: string, userId: string) => {
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
          createdBy: userId,
          updatedBy: userId,
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

const getRandomDateWithinLast90Days = () => {
  return new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000))
}

seed()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
