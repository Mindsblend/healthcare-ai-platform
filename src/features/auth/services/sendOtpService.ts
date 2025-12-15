// features/auth/services/sms-otp.service.ts
import https from 'https'

const OTP_API_KEY = process.env.MELIPAYAMAK_OTP_KEY!

export function sendOtpViaSms(phone: string): Promise<{ code: string }> {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ to: phone })

    const options = {
      hostname: 'console.melipayamak.com',
      port: 443,
      path: `/api/send/otp/${OTP_API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    }

    const req = https.request(options, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', async () => {
        if (res.statusCode === 200) {
          // Optionally, parse the response to check if SMS was actually accepted
          try {
            const json = JSON.parse(data)
            console.log(
              'Melipayamak response object:',
              JSON.stringify(json, null, 2),
            )

            if (json?.status === 'ارسال موفق بود' && json?.code) {
              resolve({ code: json.code })
            } else {
              reject(new Error(json?.Message || 'SMS provider failed'))
            }
          } catch {
            reject(new Error(`SMS provider error: ${res.statusCode} - ${data}`))
          }
        }
      })
    })

    req.on('error', (err) => reject(err))
    req.write(payload)
    req.end()
  })
}
