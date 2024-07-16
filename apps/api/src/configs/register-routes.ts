/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyInstance } from 'fastify'
import fs from 'fs/promises'
import path from 'path'

export async function registerRoutes(app: FastifyInstance) {
  const routesDir = await getRoutesDir()
  const routesToRegister = await getRoutesToRegister(routesDir)

  for (const route of routesToRegister) {
    app.register(route)
  }
}

const getRoutesDir = async () => {
  const dirFiles = await fs.readdir(__dirname)

  const dir = !dirFiles.includes('routes')
    ? path.join(__dirname, '..', 'routes')
    : path.join(__dirname, 'routes')

  return dir
}

const getRoutesToRegister: (dir: string) => Promise<any[]> = async (dir: string) => {
  const routes: any[] = []

  const files = await getDirValidFilePaths(dir)

  for (const file of files) {
    try {
      const routeModule = await import(file)
      routes.push(routeModule.default)
    } catch (error) {
      console.error(`Failed to import route file: ${file}`, error)
    }
  }

  return routes
}

const getDirValidFilePaths = async (dir: string) => {
  const files: string[] = []

  const allFiles = await fs.readdir(dir)

  for (const file of allFiles) {
    const isValidFile = file.endsWith('.ts') || file.endsWith('.js')

    if (!isValidFile) {
      continue
    }

    const filePath = path.join(dir, file)

    files.push(filePath)
  }

  return files
}
