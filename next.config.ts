import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  env: {
    ZARINPAL_SANDBOX: process.env.ZARINPAL_SANDBOX,
    ZARINPAL_MERCHANT_ID: process.env.ZARINPAL_MERCHANT_ID,
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
