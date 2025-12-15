import { sendOtpViaSms } from '@/features/auth/services/sendOtpService'
import { saveOtp } from '@/features/auth/services/storeOtpService'

export async function POST(req: Request) {
  try {
    const { identifier } = await req.json()

    if (!identifier) {
      return Response.json({ error: 'Identifier is required' }, { status: 400 })
    }

    console.log(`OTP request for: ${identifier}`)

    // Send OTP
    const { code } = await sendOtpViaSms(identifier)
    console.log("OTP code sent")

    // Store OTP
    await saveOtp(identifier, code)
    console.log("OTP code saved")

    return Response.json({ success: true })
  } catch (error) {
    console.error('OTP Send Error:', error)
    return Response.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}
