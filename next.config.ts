import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Keep the Playwright dev server isolated from a developer's normal `.next`
  // process, which lets it start with the dedicated E2E environment.
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
    ],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ]
  },
}

export default nextConfig
