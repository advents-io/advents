import { dayjs, fetchUrlOgImage, nanoid } from '@advents/common'
import { supabaseServerAdmin } from '@advents/supabase'
import { faker } from '@faker-js/faker'

import { Link as LinkDb, prisma } from '..'
import { APP, LINKS } from './data'

type Link = Omit<LinkDb, 'clickCount' | 'installCount' | 'revenueCount'>

async function seed() {
  console.log('1/5 - Creating member...')
  const { teamId, userId } = await createMember()

  console.log('2/5 - Creating app...')
  const { appId } = await createApp(teamId, userId)

  console.log('3/5 - Creating links...')
  const links = await createLinks(appId, userId)

  console.log('4/5 - Creating analytics data...')
  await createAnalyticsData(links, appId)

  console.log('5/5 - Running scripts...')
  await grantAccessAndPrivileges()
  await createIncrementLinkClicksFunction()
}

const createMember = async () => {
  const supabase = await supabaseServerAdmin()

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
  const imageUrl = await fetchUrlOgImage(APP.androidUrl)

  if (!imageUrl) {
    throw new Error('App image not found')
  }

  const apiKey = 'advents_NqL92oPEAbY1Qs3OHFx8NK9r' // API key used in example apps

  const { id: appId } = await prisma.app.create({
    data: {
      ...APP,
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

const createLinks = async (appId: string, userId: string) => {
  const LINKS_TO_CREATE = 20

  if (LINKS_TO_CREATE > LINKS.length) {
    throw new Error('Links count to create is greater than the number of available links data.')
  }

  const RANDOM_LINKS = faker.helpers.arrayElements(LINKS, LINKS_TO_CREATE)

  const links: Link[] = Array.from({ length: LINKS_TO_CREATE }, (_, index) => {
    const createdAt = faker.date.between({
      from: dayjs().add(-180, 'days').toDate(),
      to: Date.now(),
    })

    return {
      id: crypto.randomUUID(),
      title: RANDOM_LINKS[index].name,
      domain: APP.defaultDomain,
      slug: Math.random() < 0.4 ? RANDOM_LINKS[index].slug : nanoid(),
      iosUrl: APP.iosUrl,
      androidUrl: APP.androidUrl,
      fallbackUrl: APP.defaultFallbackUrl,
      campaignCost: faker.datatype.boolean() ? 0 : faker.number.int({ min: 10, max: 1000 }),
      appId,
      createdAt,
      updatedAt: createdAt,
      createdBy: userId,
      updatedBy: userId,
    }
  })

  await prisma.link.createMany({
    data: links,
  })

  return links
}

const createAnalyticsData = async (links: Link[], appId: string) => {
  for (const link of links) {
    process.stdout.clearLine(0)
    process.stdout.cursorTo(0)
    process.stdout.write(`Link ${links.indexOf(link) + 1} of ${links.length}`)

    const clickCount = faker.datatype.boolean(0.7) ? faker.number.int({ min: 0, max: 10000 }) : 0

    const clicks = Array.from({ length: clickCount }, () => ({
      id: crypto.randomUUID(),
      destinationUrl: link.iosUrl,
      referer: '(direct)',
      refererUrl: '(direct)',
      isBot: false,
      linkId: link.id,
      appId,
      createdAt: faker.date.between({ from: link.createdAt, to: Date.now() }),
    }))

    const clicksAndSessions = clicks.map(click => ({
      click,
      session: {
        id: crypto.randomUUID(),
        appId,
        createdAt: click.createdAt,
      },
    }))

    const installCount = Math.round(
      faker.number.int({ min: clickCount * 0.001, max: clickCount * 0.2 }),
    )

    const clicksAndSessionsConvertedToInstalls = faker.helpers.arrayElements(
      clicksAndSessions,
      installCount,
    )

    await prisma.$transaction([
      prisma.click.createMany({ data: clicks }),

      prisma.session.createMany({
        data: clicksAndSessions.map(item => item.session),
      }),

      prisma.attribution.createMany({
        data: clicksAndSessionsConvertedToInstalls.map(({ click, session }) => ({
          method: 'ios_deterministic_click',
          sessionId: session.id,
          clickId: click.id,
          linkId: link.id,
          appId,
          createdAt: session.createdAt,
        })),
      }),

      prisma.link.update({
        where: { id: link.id },
        data: {
          clickCount,
          installCount,
        },
      }),
    ])

    process.stdout.clearLine(0)
    process.stdout.cursorTo(0)
    process.stdout.write(`Link ${links.indexOf(link) + 1} of ${links.length}`)
  }

  process.stdout.write('\n')
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
