import { beforeEach, describe, expect, it, vi } from 'vitest'

const { sendMailMock, createTransportMock, generateOtpMock } = vi.hoisted(
  () => {
    process.env.SMTP_USER = 'otp-test@gmail.com'
    process.env.SMTP_PASS = 'test-app-password'
    delete process.env.SMTP_HOST
    delete process.env.SMTP_PORT
    delete process.env.SMTP_FROM

    const sendMail = vi.fn()

    const createTransport = vi.fn(() => ({
      sendMail,
    }))

    return {
      sendMailMock: sendMail,
      createTransportMock: createTransport,
      generateOtpMock: vi.fn(),
    }
  },
)

vi.mock('nodemailer', () => ({
  default: {
    createTransport: createTransportMock,
  },
}))

vi.mock('@/lib/helpers', () => ({
  generateOtp: generateOtpMock,
}))

import { sendOtpViaEmail } from '@/features/auth/services/sendEmailOtpService'

describe('sendEmailOtpService', () => {
  beforeEach(() => {
    sendMailMock.mockClear()
    generateOtpMock.mockClear()

    generateOtpMock.mockReturnValue('123456')
    sendMailMock.mockResolvedValue({ messageId: 'test-message-id' })
  })

  it('generates an OTP and sends an email', async () => {
    const result = await sendOtpViaEmail('user@example.com')

    expect(createTransportMock).toHaveBeenCalledWith(
      expect.objectContaining({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'otp-test@gmail.com',
          pass: 'test-app-password',
        },
      }),
    )
    expect(generateOtpMock).toHaveBeenCalledOnce()

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: 'user@example.com',
        subject: 'Your login code',
        text: 'Your verification code is: 123456',
        html: '<p>Your verification code is:</p><h2>123456</h2>',
      }),
    )

    expect(result).toBe('123456')
  })

  it('returns the generated OTP after sending the email', async () => {
    generateOtpMock.mockReturnValue('654321')

    const result = await sendOtpViaEmail('another@example.com')

    expect(result).toBe('654321')
    expect(sendMailMock).toHaveBeenCalledOnce()
  })

  it('throws when the email provider fails', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    sendMailMock.mockRejectedValue(new Error('SMTP connection failed'))

    await expect(sendOtpViaEmail('user@example.com')).rejects.toMatchObject({
      code: 'EMAIL_PROVIDER_FAILED',
    })
    expect(consoleError).toHaveBeenCalledWith(
      '[sendOtpViaEmail] SMTP delivery failed',
      { code: 'UNKNOWN' },
    )
    consoleError.mockRestore()
  })

  it('fails without generating or sending an OTP when SMTP credentials are missing', async () => {
    const previousUser = process.env.SMTP_USER
    const previousPassword = process.env.SMTP_PASS
    delete process.env.SMTP_USER
    delete process.env.SMTP_PASS

    try {
      await expect(sendOtpViaEmail('user@example.com')).rejects.toMatchObject({
        code: 'EMAIL_PROVIDER_FAILED',
      })
      expect(generateOtpMock).not.toHaveBeenCalled()
      expect(sendMailMock).not.toHaveBeenCalled()
    } finally {
      process.env.SMTP_USER = previousUser
      process.env.SMTP_PASS = previousPassword
    }
  })
})
