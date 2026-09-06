'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSidebar } from '../context/SidebarContext'
import { NavItem } from '../types/types'

const navItems: NavItem[] = [
  {
    icon: '/images/binoculars.svg',
    name: 'داشبورد',
    path: '/dashboard',
  },
  {
    icon: '/images/box.svg',
    name: 'مدیریت محصولات',
    path: '/dashboard/products',
    subItems: [
      { name: 'محصولات', path: '/dashboard/products' },
      { name: 'ساخت محصول', path: '/dashboard/addproduct' },
    ],
  },
  {
    icon: '/images/folder.svg',
    name: 'مدیریت مجموعه‌ها',
    path: '/dashboard/collections',
    subItems: [
      { name: 'مجموعه‌ها', path: '/dashboard/collections' },
      { name: 'ساخت مجموعه', path: '/dashboard/addcollection' },
    ],
  },
  {
    icon: '/images/file.svg',
    name: 'سفارشات',
    path: '/dashboard/orders',
  },
  {
    icon: '/images/pencil.svg',
    name: 'مدیریت بلاگ ها',
    path: '/dashboard/blogs',
    subItems: [
      { name: 'بلاگ', path: '/dashboard/blogs' },
      { name: 'ساخت بلاگ', path: '/dashboard/addblog' },
    ],
  },
]

const AppSidebar: React.FC = () => {
  const {
    isExpanded,
    isMobileOpen,
    isHovered,
    setIsHovered,
    toggleMobileSidebar,
  } = useSidebar()

  const pathname = usePathname()

  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [subMenuHeight, setSubMenuHeight] = useState<Record<number, number>>({})

  const subMenuRefs = useRef<Record<number, HTMLDivElement | null>>({})

  const isActive = useCallback((path: string) => path === pathname, [pathname])

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  // Calculate submenu height
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

  // Close mobile sidebar after navigation
  useEffect(() => {
    if (isMobileOpen) {
      toggleMobileSidebar()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <>
      {/* =========================
          Mobile Overlay
      ========================== */}
      {isMobileOpen && (
        <div
          onClick={toggleMobileSidebar}
          className="fixed inset-0 z-[998] bg-black/40 backdrop-blur-[1px] lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* =========================
          Sidebar
      ========================== */}
      <aside
        className={`/* Mobile */ fixed top-0 right-0 z-[999] flex h-screen w-[290px] flex-col border-l border-gray-200 bg-white px-5 shadow-xl transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900 ${isMobileOpen ? 'translate-x-0' : 'translate-x-full'} /* Desktop */ lg:translate-x-0 lg:shadow-none ${
          isExpanded || isHovered ? 'lg:w-[290px]' : 'lg:w-[90px]'
        } `}
        onMouseEnter={() => {
          if (!isExpanded) {
            setIsHovered(true)
          }
        }}
        onMouseLeave={() => {
          setIsHovered(false)
        }}
      >
        {/* =========================
            Logo
        ========================== */}
        <div
          className={`flex py-8 ${
            !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
          } `}
        >
          <Link
            href="/"
            onClick={() => {
              if (isMobileOpen) {
                toggleMobileSidebar()
              }
            }}
          >
            {/* Desktop Expanded / Mobile */}
            {isExpanded || isHovered || isMobileOpen ? (
              <Image
                src="/images/logo.svg"
                alt="Logo"
                width={130}
                height={20}
                priority
                className="h-auto w-[130px]"
              />
            ) : (
              /* Desktop Collapsed */
              <Image
                src="/images/logo.svg"
                alt="Logo"
                width={32}
                height={32}
                priority
                className="h-8 w-8 object-contain"
              />
            )}
          </Link>
        </div>

        {/* =========================
            Navigation
        ========================== */}
        <div className="no-scrollbar flex flex-1 flex-col overflow-y-auto">
          <nav className="mb-6">
            {/* Navigation Title */}
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

            {/* Navigation Items */}
            <ul className="flex flex-col gap-3">
              {navItems.map((nav, index) => (
                <li key={nav.name}>
                  {/* =========================
                      Parent with Submenu
                  ========================== */}
                  {nav.subItems ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleToggle(index)}
                        className="menu-item group flex w-full items-center justify-between"
                      >
                        <div className="flex items-center justify-center gap-3">
                          <Image
                            src={nav.icon}
                            alt={nav.name}
                            width={20}
                            height={20}
                            className="shrink-0"
                          />

                          {(isExpanded || isHovered || isMobileOpen) && (
                            <span className="menu-item-text text-black dark:text-white">
                              {nav.name}
                            </span>
                          )}
                        </div>

                        {(isExpanded || isHovered || isMobileOpen) && (
                          <Image
                            src="/images/dropdown.svg"
                            alt="dropdown"
                            width={15}
                            height={15}
                            className={`shrink-0 transition-transform duration-200 ${
                              openIndex === index ? 'rotate-180' : ''
                            } `}
                          />
                        )}
                      </button>

                      {/* Submenu */}
                      {(isExpanded || isHovered || isMobileOpen) && (
                        <div
                          ref={(el) => {
                            subMenuRefs.current[index] = el
                          }}
                          className="overflow-hidden transition-all duration-300 ease-in-out"
                          style={{
                            height:
                              openIndex === index
                                ? `${subMenuHeight[index] || 0}px`
                                : '0px',
                          }}
                        >
                          <ul className="mt-2 mr-9 space-y-1">
                            {nav.subItems.map((sub) => (
                              <li key={sub.name}>
                                <Link
                                  href={sub.path}
                                  onClick={() => {
                                    if (isMobileOpen) {
                                      toggleMobileSidebar()
                                    }
                                  }}
                                  className={`menu-dropdown-item ${
                                    isActive(sub.path)
                                      ? 'menu-dropdown-item-active'
                                      : 'menu-dropdown-item-inactive'
                                  } `}
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    /* =========================
                        Normal Link
                    ========================== */
                    nav.path && (
                      <Link
                        href={nav.path}
                        onClick={() => {
                          if (isMobileOpen) {
                            toggleMobileSidebar()
                          }
                        }}
                        className={`menu-item group flex items-center gap-3 ${
                          isActive(nav.path)
                            ? 'menu-item-active'
                            : 'menu-item-inactive'
                        } `}
                      >
                        <Image
                          src={nav.icon}
                          alt={nav.name}
                          width={20}
                          height={20}
                          className="shrink-0"
                        />

                        {(isExpanded || isHovered || isMobileOpen) && (
                          <span className="menu-item-text">{nav.name}</span>
                        )}
                      </Link>
                    )
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  )
}

export default AppSidebar
