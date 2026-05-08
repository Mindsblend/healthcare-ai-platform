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
  user: ['/cart', '/order', '/profile'],
  admin: ['/dashboard'],
}

export function getRouteType(pathname: string): 'public' | 'user' | 'admin' {
  const matchesRoute = (route: string) => {
    // Exact match OR subpath match (with slash)
    return pathname === route || pathname.startsWith(route + '/')
  }

  // Check admin first (more restrictive)
  if (routeConfig.admin.some(matchesRoute)) {
    return 'admin'
  }

  // Then user routes
  if (routeConfig.user.some(matchesRoute)) {
    return 'user'
  }

  return 'public'
}
