import nodemailer from 'nodemailer'
import { generateOtp } from '@/lib/helpers'
import { createDomainError, ErrorCode } from '@/lib/errors'
import { EmailConfig, EmailOptions } from '../auth.types'

const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com'
const smtpPort = Number(
  process.env.SMTP_PORT || (smtpHost === 'smtp.gmail.com' ? 465 : 587),
)

const emailConfig: EmailConfig = {
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
}

const transporter = nodemailer.createTransport(emailConfig)

export async function sendOtpViaEmail(email: string) {
  const sender = process.env.SMTP_FROM || process.env.SMTP_USER
  if (!sender || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw createDomainError(ErrorCode.EMAIL_PROVIDER_FAILED)
  }

  const code = generateOtp()

  const mailOptions: EmailOptions = {
    from: sender,
    to: email,
    subject: 'Your login code',
    text: `Your verification code is: ${code}`,
    html: `<p>Your verification code is:</p><h2>${code}</h2>`,
  }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    const code =
      typeof error === 'object' && error !== null && 'code' in error
        ? String(error.code)
        : 'UNKNOWN'
    console.error('[sendOtpViaEmail] SMTP delivery failed', { code })
    throw createDomainError(ErrorCode.EMAIL_PROVIDER_FAILED)
  }

  return code
}
