import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  distDir: process.env.E2E_TEST_MODE === 'true' ? '.next-e2e' : '.next',

  env: {
    ZARINPAL_SANDBOX: process.env.ZARINPAL_SANDBOX,
    ZARINPAL_MERCHANT_ID: process.env.ZARINPAL_MERCHANT_ID,
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dkstatics-public.digikala.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/feed',
        destination: '/',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ]
  },

  serverExternalPackages: ['esbuild', 'esbuild-wasm'],
}

export default nextConfig