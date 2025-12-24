import type { Metadata } from 'next'
import localFont from 'next/font/local'
import '../../../globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

/* ============================
   Headers: Aria Font Family
   ============================ */
const AriaFont = localFont({
  src: [
    /* Thin */
    {
      path: '../../../public/fonts/Aria/Aria-Thin.woff2',
      weight: '100',
      style: 'normal',
    },

    /* Light */
    {
      path: '../../../public/fonts/Aria/Aria-Light.woff2',
      weight: '300',
      style: 'normal',
    },

    /* Regular */
    {
      path: '../../../public/fonts/Aria/Aria-Regular.woff2',
      weight: '400',
      style: 'normal',
    },

    /* Medium */
    {
      path: '../../../public/fonts/Aria/Aria-Medium.woff2',
      weight: '500',
      style: 'normal',
    },

    /* Bold */
    {
      path: '../../../public/fonts/Aria/Aria-Bold.woff2',
      weight: '700',
      style: 'normal',
    },

    /* Extra Bold */
    {
      path: '../../../public/fonts/Aria/Aria-ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },

    /* Heavy */
    {
      path: '../../../public/fonts/Aria/Aria-Heavy.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-aria',
  display: 'swap',
})

/* ============================
   Paragraphs: Ray Font Family
   ============================ */
const RayFont = localFont({
  src: [
    /* Light - 300 */
    {
      path: '../../../public/fonts/Ray/Ray-Light.ttf',
      weight: '300',
      style: 'normal',
    },

    /* Regular - 400 */
    {
      path: '../../../public/fonts/Ray/Ray.ttf',
      weight: '400',
      style: 'normal',
    },

    /* Medium - 500 */
    {
      path: '../../../public/fonts/Ray/Ray-Medium.ttf',
      weight: '500',
      style: 'normal',
    },

    /* Extra Bold - 700 */
    {
      path: '../../../public/fonts/Ray/Ray-ExtraBold.ttf',
      weight: '700',
      style: 'normal',
    },

    /* Heavy - 900 */
    {
      path: '../../../public/fonts/Ray/Ray-Black.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-ray',
  display: 'swap',
})

/* App Info and Metadata */
export const metadata: Metadata = {
  title: 'Attari24h',
  description: 'An AI integrated healthcare platform',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" dir="rtl">
      <body
        className={`${AriaFont.variable} ${RayFont.variable} antialiased`}
        style={
          {
            '--color-primary': '#1B2024',
            '--color-secondary': '#23282D',
            '--color-accent': '#B1C8FF',
            '--color-dark-bg': '#161A1D',
            '--color-gray-text': '#6A7073',
            // add more custom colors here
          } as React.CSSProperties
        }
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
