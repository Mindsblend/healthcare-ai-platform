import { createDomainError, ErrorCode } from './errors.ts'

export default function generateSlug(name: string) {
  return name
    .trim()
    .replace(/\s+/g, '-') // spaces → dash
    .replace(/[^\p{L}\p{N}-]+/gu, '') // remove symbols
}

export async function validateIdentifier(identifier: string) {
  if (!identifier) throw createDomainError(ErrorCode.MISSING_IDENTIFIER)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (emailRegex.test(identifier)) {
    const email = identifier.trim().toLowerCase()
    return { type: 'email', value: email }
  }

  // Otherwise treat as phone
  let phone = identifier.replace(/\D/g, '') // remove non-digits

  // Normalize Iranian phones
  if (phone.startsWith('98') && phone.length === 12) {
    phone = '0' + phone.slice(2) // e.g. 989991014300 → 09991014300
  } else if (phone.length === 10 && phone.startsWith('9')) {
    phone = '0' + phone // e.g. 9991014300 → 09991014300
  }

  // Final validation
  if (!/^09\d{9}$/.test(phone)) {
    throw createDomainError(ErrorCode.INVALID_PHONE_NUMBER)
  }

  return { type: 'phone', value: phone }
}

export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
