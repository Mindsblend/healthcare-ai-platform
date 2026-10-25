import { beforeEach, describe, expect, it, vi } from 'vitest'

const { sendMailMock, createTransportMock, generateOtpMock } = vi.hoisted(
  () => {
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
    vi.clearAllMocks()

    generateOtpMock.mockReturnValue('123456')
    sendMailMock.mockResolvedValue({ messageId: 'test-message-id' })
  })

  it('generates an OTP and sends an email', async () => {
    const result = await sendOtpViaEmail('user@example.com')

    expect(generateOtpMock).toHaveBeenCalledOnce()

    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({
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
    sendMailMock.mockRejectedValue(new Error('SMTP connection failed'))

    await expect(sendOtpViaEmail('user@example.com')).rejects.toThrow(
      'SMTP connection failed',
    )
  })
})
