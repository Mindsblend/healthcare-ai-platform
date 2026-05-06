export const routeConfig = {
  public: [
    '/',
    '/ai',
    '/products',
    '/products/[slug]',
    '/blogs',
    '/blogs/[slug]',
    '/auth',
  ],
  user: ['/cart', '/order', '/profile/:path*'],
  admin: ['/dashboard/:path*'],
}

export function getRouteType(pathname: string): 'public' | 'user' | 'admin' {
  if (routeConfig.admin.some((route) => pathname.startsWith(route))) {
    return 'admin'
  }
  if (routeConfig.user.some((route) => pathname.startsWith(route))) {
    return 'user'
  }
  return 'public'
}
