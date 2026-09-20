'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'

const HIDDEN_ROUTES = ['/auth']

export function shouldShowBottomNav(pathname: string, user: unknown) {
  if (!user) return false
  return !HIDDEN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )
}

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

const HomeIcon = () => (
  <Svg>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M9 22V12h6v10" />
  </Svg>
)

const BagIcon = () => (
  <Svg>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </Svg>
)

const SparkIcon = () => (
  <Svg>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
    <path d="M19 16v4M17 18h4" />
  </Svg>
)

const CartIcon = () => (
  <Svg>
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </Svg>
)

const UserIcon = () => (
  <Svg>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Svg>
)

const ITEMS = [
  {
    href: '/',
    label: 'خانه',
    icon: HomeIcon,
    activeFor: ['/', '/feed'],
  },
  {
    href: '/products',
    label: 'محصولات',
    icon: BagIcon,
    activeFor: ['/products', '/shop'],
  },
  { href: '/ai', label: 'هوش مصنوعی', icon: SparkIcon, activeFor: ['/ai'] },
  { href: '/cart', label: 'سبد خرید', icon: CartIcon, activeFor: ['/cart'] },
  {
    href: '/profile',
    label: 'پروفایل',
    icon: UserIcon,
    activeFor: ['/profile'],
  },
]

/* -------------------------------- Component ------------------------------- */

export default function BottomNav({ cartCount }: { cartCount: number }) {
  const pathname = usePathname()

  useEffect(() => {
    document.body.classList.add('has-bottom-nav')
    return () => document.body.classList.remove('has-bottom-nav')
  }, [])

  const matches = (path: string) =>
    path === '/'
      ? pathname === '/'
      : pathname === path || pathname.startsWith(`${path}/`)

  return (
    <nav
      aria-label="ناوبری اصلی"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="flex h-16 items-stretch">
        {ITEMS.map(({ href, label, icon: Icon, activeFor }) => {
          const active = activeFor.some(matches)

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`font-ray flex h-full flex-col items-center justify-center gap-1 text-[11px] whitespace-nowrap transition-colors ${
                  active ? 'font-bold text-black' : 'font-medium text-gray-400'
                }`}
              >
                <span className="relative">
                  <Icon />

                  {href === '/cart' && cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-0.5 text-[10px] leading-none font-bold text-white">
                      {cartCount > 99
                        ? '۹۹+'
                        : cartCount.toLocaleString('fa-IR')}
                    </span>
                  )}
                </span>

                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
