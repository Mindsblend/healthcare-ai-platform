'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSidebar } from '../context/SidebarContext'

type NavItem = {
  name: string
  icon: string
  path?: string
  subItems?: { name: string; path: string }[]
}

const navItems: NavItem[] = [
  { icon: '/images/grid.svg', name: 'داشبورد', path: '/dashboard' },
  {
    icon: '/images/grid.svg',
    name: 'مدیریت محصولات',
    path: '/dashboard/products',
    subItems: [
      { name: 'محصولات', path: '/dashboard/products' },
      { name: 'ساخت محصول', path: '/dashboard/addproduct' },
    ],
  },
  { icon: '/images/grid.svg', name: 'سفارشات', path: '/dashboard/orders' },
  {
    icon: '/images/grid.svg',
    name: 'مدیریت بلاگ ها',
    path: '/dashboard/products',
    subItems: [
      { name: 'بلاگ', path: '/dashboard/blogs' },
      { name: 'ساخت بلاگ', path: '/dashboard/addblog' },
    ],
  },
]

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar()
  const pathname = usePathname()

  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [subMenuHeight, setSubMenuHeight] = useState<Record<number, number>>({})

  const subMenuRefs = useRef<Record<number, HTMLDivElement | null>>({})

  const isActive = useCallback((path: string) => path === pathname, [pathname])

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  /* =====================================
     Dynamic Height Calculation
  ===================================== */
  useEffect(() => {
    if (openIndex !== null) {
      const el = subMenuRefs.current[openIndex]
      if (el) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [openIndex]: el.scrollHeight,
        }))
      }
    }
  }, [openIndex])

  return (
    <aside
      className={`fixed top-0 right-0 z-50 mt-16 flex h-screen flex-col border-r border-gray-200 bg-white px-5 transition-all duration-300 ease-in-out lg:mt-0 dark:border-gray-800 dark:bg-gray-900 ${
        isExpanded || isHovered || isMobileOpen ? 'w-[290px]' : 'w-[90px]'
      } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div
        className={`flex py-8 ${
          !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
        }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className=""
                src="/images/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <Image src="/images/logo.svg" alt="Logo" width={32} height={32} />
          )}
        </Link>
      </div>

      {/* Menu */}
      <div className="no-scrollbar flex flex-col overflow-y-auto">
        <nav className="mb-6">
          <h2 className="mb-4 text-xs text-gray-400 uppercase">
            {isExpanded || isHovered || isMobileOpen ? (
              'منو'
            ) : (
              <Image
                src="/images/horizontal-dots.svg"
                alt="More"
                width={16}
                height={16}
              />
            )}
          </h2>

          <ul className="flex flex-col gap-4">
            {navItems.map((nav, index) => (
              <li key={nav.name}>
                {/* =========================
                   Main Item
                ========================= */}
                {nav.subItems ? (
                  <button
                    onClick={() => handleToggle(index)}
                    className="menu-item group flex w-full items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={nav.icon}
                        alt={nav.name}
                        width={20}
                        height={20}
                      />
                      {(isExpanded || isHovered || isMobileOpen) && (
                        <span className="menu-item-text text-black">
                          {nav.name}
                        </span>
                      )}
                    </div>
                    <Image
                      src="/images/dropdown.png"
                      alt="dropdown"
                      width={15}
                      height={15}
                      className={`${openIndex === index ? 'rotate-180' : ''}`}
                    />
                  </button>
                ) : (
                  nav.path && (
                    <Link
                      href={nav.path}
                      className={`menu-item group flex items-center gap-3 ${
                        isActive(nav.path)
                          ? 'menu-item-active'
                          : 'menu-item-inactive'
                      }`}
                    >
                      <Image
                        src={nav.icon}
                        alt={nav.name}
                        width={20}
                        height={20}
                      />
                      {(isExpanded || isHovered || isMobileOpen) && (
                        <span className="menu-item-text">{nav.name}</span>
                      )}
                    </Link>
                  )
                )}

                {/* =========================
                   Sub Menu
                ========================= */}
                {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
                  <div
                    ref={(el) => {
                      subMenuRefs.current[index] = el
                    }}
                    className="overflow-hidden transition-all duration-300"
                    style={{
                      height:
                        openIndex === index
                          ? `${subMenuHeight[index] || 0}px`
                          : '0px',
                    }}
                  >
                    <ul className="mt-2 ml-9 space-y-1">
                      {nav.subItems.map((sub) => (
                        <li key={sub.name}>
                          <Link
                            href={sub.path}
                            className={`menu-dropdown-item ${
                              isActive(sub.path)
                                ? 'menu-dropdown-item-active'
                                : 'menu-dropdown-item-inactive'
                            }`}
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}

export default AppSidebar
