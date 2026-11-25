import { describe, expect, it } from 'vitest'
import { isInternalUrl } from '@/lib/helpers'

describe('isInternalUrl', () => {
  it('returns true for internal paths starting with /', () => {
    expect(isInternalUrl('/')).toBe(true)
    expect(isInternalUrl('/cart')).toBe(true)
    expect(isInternalUrl('/order')).toBe(true)
    expect(isInternalUrl('/auth?callbackUrl=/order')).toBe(true)
    expect(isInternalUrl('/products/123')).toBe(true)
  })

  it('returns false for empty or non-string input', () => {
    expect(isInternalUrl('')).toBe(false)
    expect(isInternalUrl(null as unknown as string)).toBe(false)
    expect(isInternalUrl(undefined as unknown as string)).toBe(false)
    expect(isInternalUrl(123 as unknown as string)).toBe(false)
  })

  it('returns false for absolute URLs (http/https)', () => {
    expect(isInternalUrl('https://evil.com')).toBe(false)
    expect(isInternalUrl('http://evil.com/cart')).toBe(false)
    expect(isInternalUrl('ftp://evil.com')).toBe(false)
  })

  it('returns false for protocol-relative URLs starting with //', () => {
    expect(isInternalUrl('//evil.com')).toBe(false)
    expect(isInternalUrl('//evil.com/cart')).toBe(false)
  })

  it('returns false for data and javascript URLs', () => {
    expect(isInternalUrl('data:text/html,<script>alert(1)</script>')).toBe(false)
    expect(isInternalUrl('javascript:alert(1)')).toBe(false)
  })
})
