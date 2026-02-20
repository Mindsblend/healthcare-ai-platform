'use client'

import React from 'react'
import {
  SidebarProvider,
  useSidebar,
} from '@/components/context/SidebarContext'
import '../../../styles/dashboard.css'

import AppHeader from '@/components/layout/AppHeader'
import AppSidebar from '@/components/layout/AppSidebar'
import Backdrop from '@/components/layout/Backdrop'
import { ThemeProvider } from '@/components/context/ThemeContext'
import localFont from 'next/font/local'

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

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar()

  const mainContentMargin = isMobileOpen
    ? 'mr-0'
    : isExpanded || isHovered
      ? 'lg:mr-[290px]'
      : 'lg:mr-[90px]'

  return (
    <div className="min-h-screen xl:flex" dir="rtl">
      <AppSidebar />
      <Backdrop />
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        <AppHeader />
        <div
          className={`mx-auto max-w-(--breakpoint-2xl) p-4 md:p-6 ${AriaFont.variable} ${RayFont.variable} antialiased`}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <LayoutContent>{children}</LayoutContent>
      </SidebarProvider>
    </ThemeProvider>
  )
}
