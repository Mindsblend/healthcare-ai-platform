import https from 'https'
import { EventEmitter } from 'events'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { generateOtpMock, createDomainErrorMock, requestMock } = vi.hoisted(
  () => ({
    generateOtpMock: vi.fn(),
    createDomainErrorMock: vi.fn((code: string, details?: unknown) =>
      Object.assign(new Error(code), { code, details }),
    ),
    requestMock: vi.fn(),
  }),
)

process.env.SMSIR_API_KEY = 'test-api-key'

vi.mock('@/lib/helpers', () => ({
  generateOtp: generateOtpMock,
}))

vi.mock('@/lib/errors', () => ({
  createDomainError: createDomainErrorMock,
  ErrorCode: {
    OTP_PROVIDER_FAILED: 'OTP_PROVIDER_FAILED',
    OTP_PROVIDER_TIMEOUT: 'OTP_PROVIDER_TIMEOUT',
  },
}))

vi.mock('https', () => ({
  default: {
    request: requestMock,
  },
}))

let sendOtpViaSms: typeof import('@/features/auth/services/sendSmsOtpService').sendOtpViaSms

function setupHttpsResponse(statusCode: number, body: string) {
  const request = new EventEmitter() as EventEmitter & {
    write: ReturnType<typeof vi.fn>
    end: ReturnType<typeof vi.fn>
  }

  request.write = vi.fn()
  request.end = vi.fn()

  requestMock.mockImplementationOnce(
    (
      _options: unknown,
      callback: (response: EventEmitter & { statusCode: number }) => void,
    ) => {
      const response = new EventEmitter() as EventEmitter & {
        statusCode: number
      }

      response.statusCode = statusCode

      callback(response)
      response.emit('data', body)
      response.emit('end')

      return request
    },
  )

  return request
}

function setupHttpsError() {
  const request = new EventEmitter() as EventEmitter & {
    write: ReturnType<typeof vi.fn>
    end: ReturnType<typeof vi.fn>
  }

  request.write = vi.fn()
  request.end = vi.fn(() => {
    request.emit('error', new Error('Network failure'))
  })

  requestMock.mockReturnValueOnce(request)

  return request
}

describe('sendOtpViaSms', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    process.env.SMSIR_API_KEY = 'test-api-key'
    generateOtpMock.mockReturnValue('123456')

    vi.resetModules()

    const service = await import('@/features/auth/services/sendSmsOtpService')
    sendOtpViaSms = service.sendOtpViaSms
  })

  it('sends the OTP request and returns success', async () => {
    setupHttpsResponse(200, JSON.stringify({ status: 1 }))

    await expect(sendOtpViaSms({ phone: '09123456789' })).resolves.toEqual({
      success: true,
      code: '123456',
    })

    expect(generateOtpMock).toHaveBeenCalledOnce()
    expect(https.request).toHaveBeenCalledOnce()

    const [options] = requestMock.mock.calls[0]

    expect(options).toMatchObject({
      hostname: 'api.sms.ir',
      port: 443,
      path: '/v1/send/verify',
      method: 'POST',
      headers: expect.objectContaining({
        'Content-Type': 'application/json',
        'x-api-key': 'test-api-key',
      }),
    })

    const request = requestMock.mock.results[0].value

    expect(request.write).toHaveBeenCalledWith(
      JSON.stringify({
        mobile: '09123456789',
        templateId: 137663,
        parameters: [{ name: 'CODE', value: '123456' }],
      }),
    )

    expect(request.end).toHaveBeenCalledOnce()
  })

  it('rejects when the provider returns a non-200 status', async () => {
    setupHttpsResponse(500, 'Server error')

    await expect(sendOtpViaSms({ phone: '09123456789' })).rejects.toMatchObject(
      {
        code: 'OTP_PROVIDER_FAILED',
        details: {
          statusCode: 500,
          body: 'Server error',
        },
      },
    )
  })

  it('rejects when the provider returns invalid JSON', async () => {
    setupHttpsResponse(200, 'not-json')

    await expect(sendOtpViaSms({ phone: '09123456789' })).rejects.toMatchObject(
      {
        code: 'OTP_PROVIDER_FAILED',
      },
    )
  })

  it('rejects when the provider reports failure', async () => {
    setupHttpsResponse(200, JSON.stringify({ status: 0 }))

    await expect(sendOtpViaSms({ phone: '09123456789' })).rejects.toMatchObject(
      {
        code: 'OTP_PROVIDER_FAILED',
        details: {
          providerResponse: { status: 0 },
        },
      },
    )
  })

  it('rejects when the HTTPS request emits an error', async () => {
    setupHttpsError()

    await expect(sendOtpViaSms({ phone: '09123456789' })).rejects.toMatchObject(
      {
        code: 'OTP_PROVIDER_TIMEOUT',
      },
    )
  })
})
