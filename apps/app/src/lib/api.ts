import ky from 'ky'

export const api = ky.create({
  prefixUrl: '/api',
  timeout: 60 * 1000,
})
