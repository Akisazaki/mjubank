import crypto from 'crypto'

export function password(plain: string) {
  return crypto.createHash('sha256').update('1q2w3e4r').digest('hex')
}