import { FastifyInstance } from 'fastify'
import path from 'path'
import fs from 'fs/promises'

export async function registerRoutes(app: FastifyInstance) {
  const routesDir = path.join(__dirname, '..', 'routes')

  const routesToRegister = await getRoutesToRegister(routesDir)

  for (const route of routesToRegister) {
    app.register(route)
  }
}

const getRoutesToRegister: (dir: string) => Promise<any[]> = async (dir: string) => {
  const routes: any[] = []

  const files = await getDirValidFilePaths(dir)

  for (const file of files) {
    const routeModule = await import(file)

    const isDefaultFunction = typeof routeModule.default === 'function'

    if (!isDefaultFunction) {
      console.error(`Route file ${file} does not export a default function`)
    }

    const isAsync =
      routeModule.default instanceof Object &&
      routeModule.default.constructor.name === 'AsyncFunction'

    if (!isAsync) {
      console.error(`Route file ${file} does not export an async function`)
    }

    routes.push(routeModule.default)
  }

  if (routes.length === 0) {
    console.error('No routes found')
  }

  return routes
}

const getDirValidFilePaths = async (dir: string) => {
  const files: string[] = []

  const allFiles = await fs.readdir(dir)

  for (const file of allFiles) {
    const filePath = path.join(dir, file)

    const isValidFile = file.endsWith('.ts') || file.endsWith('.js')

    if (!isValidFile) {
      continue
    }

    files.push(filePath)
  }

  return files
}
