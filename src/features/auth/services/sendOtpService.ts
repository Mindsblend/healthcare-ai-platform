// features/auth/providers/melipayamak.provider.ts
import https from 'https'
import { createDomainError, ErrorCode } from '@/lib/errors'

const OTP_API_KEY = process.env.MELIPAYAMAK_OTP_KEY!

export async function sendOtpViaSms(phone: string): Promise<{ code: string }> {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ to: phone })

    const req = https.request(
      {
        hostname: 'console.melipayamak.com',
        port: 443,
        path: `/api/send/otp/${OTP_API_KEY}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        let data = ''

        res.on('data', (chunk) => (data += chunk))

        res.on('end', () => {
          if (res.statusCode !== 200) {
            return reject(createDomainError(ErrorCode.OTP_PROVIDER_FAILED))
          }

          let json: any
          try {
            json = JSON.parse(data)
          } catch (e) {
            return reject(createDomainError(ErrorCode.OTP_PROVIDER_FAILED))
          }

          if (json?.status !== 'ارسال موفق بود') {
            return reject(createDomainError(ErrorCode.OTP_PROVIDER_FAILED))
          }

          console.log(`Verification code: ${json?.code}`)

          resolve({ code: json?.code })
        })
      },
    )

    req.on('error', () => {
      reject(createDomainError(ErrorCode.OTP_PROVIDER_TIMEOUT))
    })

    req.write(payload)
    req.end()
  })
}
