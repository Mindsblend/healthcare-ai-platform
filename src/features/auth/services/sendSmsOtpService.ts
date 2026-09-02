// features/auth/providers/smsir.provider.ts
import https from 'https'
import { createDomainError, ErrorCode } from '@/lib/errors'
import { generateOtp } from '@/lib/helpers'
import { SendSmsInput, SmsProviderResponse, SmsApiPayload } from '../auth.types'

const SMSIR_API_KEY = process.env.SMSIR_API_KEY!

export async function sendOtpViaSms(
  input: SendSmsInput,
): Promise<SmsProviderResponse> {
  const { phone } = input
  const code = generateOtp()

  const payload: SmsApiPayload = {
    mobile: phone,
    templateId: 137663,
    parameters: [
      {
        name: 'CODE',
        value: code,
      },
    ],
  }

  const payloadString = JSON.stringify(payload)

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.sms.ir',
        port: 443,
        path: '/v1/send/verify',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': SMSIR_API_KEY,
          'Content-Length': Buffer.byteLength(payloadString),
        },
      },
      (res) => {
        let data = ''

        res.on('data', (chunk) => (data += chunk))
        res.on('end', () => {
          if (res.statusCode !== 200) {
            return reject(
              createDomainError(ErrorCode.OTP_PROVIDER_FAILED, {
                statusCode: res.statusCode,
                body: data,
              }),
            )
          }

          let json: any
          try {
            json = JSON.parse(data)
          } catch {
            return reject(createDomainError(ErrorCode.OTP_PROVIDER_FAILED))
          }

          if (!json?.status || json?.status !== 1) {
            console.log(
              '[SMS.IR] Provider response:',
              JSON.stringify(json, null, 2),
            )
            return reject(
              createDomainError(ErrorCode.OTP_PROVIDER_FAILED, {
                providerResponse: json,
              }),
            )
          }

          console.log('[SMS.IR] OTP sent:', phone)
          resolve({ success: true, code })
        })
      },
    )

    req.on('error', (err) => {
      reject(
        createDomainError(ErrorCode.OTP_PROVIDER_TIMEOUT, {
          originalError: err,
        }),
      )
    })

    req.write(payloadString)
    req.end()
  })
}
