import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { createSubscriptionMock } = vi.hoisted(() => ({
  createSubscriptionMock: vi.fn(),
}))

vi.mock('@/features/dashboard/services/AnalyticsService', () => ({
  AnalyticsService: {
    createSubscription: createSubscriptionMock,
  },
}))

import { POST } from '@/app/api/dashboard/blogs/subscribe/route'

function createRequest(body: unknown) {
  return new Request('http://localhost/api/dashboard/blogs/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/dashboard/blogs/subscribe', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates a subscription and returns 201', async () => {
    const input = {
      email: 'reader@example.com',
      name: 'Test Reader',
    }
    const subscription = {
      id: 'subscription-123',
      ...input,
    }

    createSubscriptionMock.mockResolvedValue(subscription)

    const response = await POST(createRequest(input))

    expect(response.status).toBe(201)
    expect(await response.json()).toEqual(subscription)
    expect(createSubscriptionMock).toHaveBeenCalledWith(input)
    expect(createSubscriptionMock).toHaveBeenCalledOnce()
  })

  it('passes the complete request payload to the service', async () => {
    const input = {
      email: 'reader@example.com',
      name: 'Test Reader',
      source: 'blog',
    }

    createSubscriptionMock.mockResolvedValue({ id: 'subscription-456' })

    await POST(createRequest(input))

    expect(createSubscriptionMock).toHaveBeenCalledWith(input)
  })

  it('returns 500 when subscription creation fails', async () => {
    createSubscriptionMock.mockRejectedValue(new Error('Database unavailable'))

    const response = await POST(createRequest({ email: 'reader@example.com' }))

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      error: 'Database unavailable',
    })
  })

  it('returns 500 when the request body contains invalid JSON', async () => {
    const request = new Request(
      'http://localhost/api/dashboard/blogs/subscribe',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{invalid json',
      },
    )

    const response = await POST(request)

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      error: expect.any(String),
    })
    expect(createSubscriptionMock).not.toHaveBeenCalled()
  })
})
