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

  const imageUrl = await fetchUrlOgImage(app.androidUrl)

  if (!imageUrl) {
    throw new Error('App image not found')
  }

  const apiKey = 'advents_NqL92oPEAbY1Qs3OHFx8NK9r' // API key used in example apps

  await prisma.app.create({
    data: {
      ...app,
      imageUrl,
      apiKeys: {
        create: {
          key: apiKey,
        },
      },
      teamId: team.id,
      createdBy: user.id,
      updatedBy: user.id,
    },
  })

  // Grant all privileges to anon, authenticated and service_role roles
  await configure()
}

const configure = async () => {
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

  // Create function to increment link clicks
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
