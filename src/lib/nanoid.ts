import { customAlphabet } from 'nanoid'

export const nanoid = () => {
  return customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 7)()
}
