import { describe, expect, it } from 'vitest'
import { getRouteType } from '@/lib/paths'

describe('getRouteType', () => {
  it('classifies public routes', () => {
    expect(getRouteType('/')).toBe('public')
    expect(getRouteType('/cart')).toBe('public')
    expect(getRouteType('/ai')).toBe('public')
    expect(getRouteType('/products')).toBe('public')
    expect(getRouteType('/products/some-slug')).toBe('public')
    expect(getRouteType('/blogs')).toBe('public')
    expect(getRouteType('/blogs/my-post')).toBe('public')
    expect(getRouteType('/auth')).toBe('public')
  })

  it('classifies user routes', () => {
    expect(getRouteType('/order')).toBe('user')
    expect(getRouteType('/order/123')).toBe('user')
    expect(getRouteType('/profile')).toBe('user')
    expect(getRouteType('/profile/address')).toBe('user')
    expect(getRouteType('/ai-test')).toBe('user')
  })

  it('classifies admin routes', () => {
    expect(getRouteType('/dashboard')).toBe('admin')
    expect(getRouteType('/dashboard/addproduct')).toBe('admin')
  })

  it('defaults unknown routes to public', () => {
    expect(getRouteType('/unknown')).toBe('public')
    expect(getRouteType('/anything-else')).toBe('public')
  })
})
