import nodemailer from 'nodemailer'
import { generateOtp } from '@/lib/helpers'
import { EmailConfig, EmailOptions } from '../auth.types'

const emailConfig: EmailConfig = {
  host: process.env.SMTP_HOST!,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
}

const transporter = nodemailer.createTransport(emailConfig)

export async function sendOtpViaEmail(email: string) {
  const code = generateOtp()

  const mailOptions: EmailOptions = {
    to: email,
    subject: 'Your login code',
    text: `Your verification code is: ${code}`,
    html: `<p>Your verification code is:</p><h2>${code}</h2>`,
  }

  await transporter.sendMail(mailOptions)

  console.log('[EMAIL SENT]', code)

  return code
}
