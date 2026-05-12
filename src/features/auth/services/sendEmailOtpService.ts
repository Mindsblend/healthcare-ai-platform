import nodemailer from 'nodemailer'
import { generateOtp } from '@/lib/helpers'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
})

export async function sendOtpViaEmail(email: string) {
  const code = generateOtp()

  await transporter.sendMail({
    from: '"زیستیار" <no-reply@support.com>',
    to: email,
    subject: 'Your login code',
    text: `Your verification code is: ${code}`,
    html: `<p>Your verification code is:</p><h2>${code}</h2>`,
  })

  console.log('[EMAIL SENT]', code)

  return code
}
