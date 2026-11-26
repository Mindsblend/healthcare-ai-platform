import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'دیجی سلامت',
    short_name: 'دیجی سلامت',
    description: 'فروشگاه محصولات سالم و ارگانیک',
    start_url: '/',
    scope: '/',
    id: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1B2024',
    lang: 'fa',
    dir: 'rtl',
    orientation: 'portrait-primary',
    categories: ['shopping', 'health', 'lifestyle'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/apple-touch-icon-180.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/badge-72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'monochrome',
      },
    ],
    screenshots: [
      {
        src: '/og/logo.svg',
        sizes: '1200x630',
        type: 'image/svg+xml',
        form_factor: 'wide',
        label: 'دیجی سلامت - فروشگاه محصولات سالم',
      },
    ],
    shortcuts: [
      {
        name: 'سبد خرید',
        short_name: 'سبد',
        description: 'مشاهده و مدیریت سبد خرید',
        url: '/cart',
        icons: [{ src: '/icons/badge-72.png', sizes: '72x72' }],
      },
      {
        name: 'سفارش‌ها',
        short_name: 'سفارش‌ها',
        description: 'مشاهده تاریخچه سفارش‌ها',
        url: '/profile/orders',
        icons: [{ src: '/icons/badge-72.png', sizes: '72x72' }],
      },
    ],
    prefer_related_applications: false,
  }
}