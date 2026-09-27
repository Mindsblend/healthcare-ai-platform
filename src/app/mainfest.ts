import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'دیجی سلامت',
    short_name: 'دیجی سلامت',
    description: 'فروشگاه محصولات سالم و ارگانیک',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1B2024',
    lang: 'fa',
    dir: 'rtl',
  }
}
