import crypto from 'crypto'

export function password(plain: string) {
  return crypto.createHash('sha256').update(plain).digest('hex')
}