import { dayjs } from '@advents/common'
import { prisma } from '@advents/db'
import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'

const getLinksAnalyticsInputSchema = z.object({
  appSlug: z.string({ message: 'Slug do app é obrigatório.' }),
  teamSlug: z.string({ message: 'Slug da equipe é obrigatório.' }),
  startDate: z
    .string({ message: 'Data de início é obrigatória.' })
    .transform(date => new Date(date)),
  endDate: z.string({ message: 'Data de fim é obrigatória.' }).transform(date => new Date(date)),
})

const getLinksAnalyticsOutputSchema = z.array(
  z.object({
    id: z.string().uuid(),
    slug: z.string(),
    domain: z.string(),
    title: z.string().nullable(),
    clicks: z.number(),
    installs: z.number(),
    campaignCost: z.number().nullable(),
    createdAt: z.date(),
  }),
)

export type GetLinksAnalyticsOutput = z.infer<typeof getLinksAnalyticsOutputSchema>

export const getLinksAnalytics = (api: Hono) =>
  api.get(
    '/analytics/links', //
    zValidator('query', getLinksAnalyticsInputSchema),
    async c => {
      const { appSlug, teamSlug, startDate, endDate } = c.req.valid('query')

      const clicks = await prisma.click.findMany({
        select: {
          link: {
            select: {
              id: true,
              slug: true,
              domain: true,
              title: true,
              campaignCost: true,
              createdAt: true,
            },
          },
          attribution: {
            select: {
              id: true,
            },
          },
        },
        where: {
          link: {
            app: {
              slug: appSlug,
              team: {
                slug: teamSlug,
              },
            },
          },
          createdAt: {
            gte: dayjs(startDate).utc().startOf('day').toDate(),
            lte: dayjs(endDate).utc().endOf('day').toDate(),
          },
        },
      })

      const links = Object.values(
        clicks.reduce(
          (acc, click) => {
            const { id } = click.link

            if (!acc[id]) {
              acc[id] = {
                id,
                slug: click.link.slug,
                domain: click.link.domain,
                title: click.link.title,
                clicks: 0,
                installs: 0,
                campaignCost: click.link.campaignCost,
                createdAt: click.link.createdAt,
              }
            }

            acc[id].clicks++

            if (click.attribution) {
              acc[id].installs++
            }

            return acc
          },
          {} as Record<
            string,
            {
              id: string
              slug: string
              domain: string
              title: string | null
              clicks: number
              installs: number
              campaignCost: number | null
              createdAt: Date
            }
          >,
        ),
      )

      return c.json(getLinksAnalyticsOutputSchema.parse(links))
    },
  )
