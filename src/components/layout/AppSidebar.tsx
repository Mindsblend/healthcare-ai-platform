'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSidebar } from '../context/SidebarContext';
import SidebarWidget from './SidebarWidget';

type NavItem = {
  name: string;
  icon: string; // now we store path string
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

// Update your navItems with image paths instead of JSX
const navItems: NavItem[] = [
  { icon: '/images/grid.svg', name: 'Dashboard', subItems: [{ name: 'Ecommerce', path: '/' }] },
  { icon: '/images/calendar.svg', name: 'Calendar', path: '/calendar' },
  { icon: '/images/user-circle.svg', name: 'User Profile', path: '/profile' },
  { icon: '/images/list.svg', name: 'Forms', subItems: [{ name: 'Form Elements', path: '/form-elements' }] },
  { icon: '/images/table.svg', name: 'Tables', subItems: [{ name: 'Basic Tables', path: '/basic-tables' }] },
  { icon: '/images/page.svg', name: 'Pages', subItems: [
      { name: 'Blank Page', path: '/blank' },
      { name: '404 Error', path: '/error-404' },
    ]},
];

const othersItems: NavItem[] = [
  { icon: '/images/pie-chart.svg', name: 'Charts', subItems: [
      { name: 'Line Chart', path: '/line-chart' },
      { name: 'Bar Chart', path: '/bar-chart' },
    ]},
  { icon: '/images/box-cube.svg', name: 'UI Elements', subItems: [
      { name: 'Alerts', path: '/alerts' },
      { name: 'Avatar', path: '/avatars' },
      { name: 'Badge', path: '/badge' },
      { name: 'Buttons', path: '/buttons' },
      { name: 'Images', path: '/images' },
      { name: 'Videos', path: '/videos' },
    ]},
  { icon: '/images/plug-in.svg', name: 'Authentication', subItems: [
      { name: 'Sign In', path: '/signin' },
      { name: 'Sign Up', path: '/signup' },
    ]},
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const [openSubmenu, setOpenSubmenu] = useState<{ type: 'main' | 'others'; index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  const handleSubmenuToggle = (index: number, menuType: 'main' | 'others') => {
    setOpenSubmenu(prev => (prev?.type === menuType && prev?.index === index ? null : { type: menuType, index }));
  };

  const renderMenuItems = (items: NavItem[], menuType: 'main' | 'others') => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${openSubmenu?.type === menuType && openSubmenu?.index === index ? 'menu-item-active' : 'menu-item-inactive'} cursor-pointer ${
                !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start'
              }`}
            >
              <span className={`${openSubmenu?.type === menuType && openSubmenu?.index === index ? 'menu-item-icon-active' : 'menu-item-icon-inactive'}`}>
                <Image src={nav.icon} alt={nav.name} width={20} height={20} />
              </span>
              {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
            </button>
          ) : (
            nav.path && (
              <Link href={nav.path} className={`menu-item group ${isActive(nav.path) ? 'menu-item-active' : 'menu-item-inactive'}`}>
                <span className={`${isActive(nav.path) ? 'menu-item-icon-active' : 'menu-item-icon-inactive'}`}>
                  <Image src={nav.icon} alt={nav.name} width={20} height={20} />
                </span>
                {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={el => { subMenuRefs.current[`${menuType}-${index}`] = el; }}
              className="overflow-hidden transition-all duration-300"
              style={{ height: openSubmenu?.type === menuType && openSubmenu?.index === index ? `${subMenuHeight[`${menuType}-${index}`]}px` : '0px' }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map(sub => (
                  <li key={sub.name}>
                    <Link href={sub.path} className={`menu-dropdown-item ${isActive(sub.path) ? 'menu-dropdown-item-active' : 'menu-dropdown-item-inactive'}`}>
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
  );

  const mainContentMargin = isMobileOpen
    ? 'ml-0'
    : isExpanded || isHovered
      ? 'lg:ml-[290px]'
      : 'lg:ml-[90px]';

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? 'w-[290px]' : isHovered ? 'w-[290px]' : 'w-[90px]'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 flex ${!isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'}`}>
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image className="dark:hidden" src="/images/logo/logo.svg" alt="Logo" width={150} height={40} />
              <Image className="hidden dark:block" src="/images/logo/logo-dark.svg" alt="Logo" width={150} height={40} />
            </>
          ) : (
            <Image src="/images/logo/logo-icon.svg" alt="Logo" width={32} height={32} />
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <h2 className={`mb-4 text-xs uppercase text-gray-400 ${!isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'}`}>
            {isExpanded || isHovered || isMobileOpen ? 'Menu' : <Image src="/images/horizontal-dots.svg" alt="More" width={16} height={16} />}
          </h2>
          {renderMenuItems(navItems, 'main')}

          <h2 className={`mb-4 text-xs uppercase text-gray-400 ${!isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'}`}>
            {isExpanded || isHovered || isMobileOpen ? 'Others' : <Image src="/images/horizontal-dots.svg" alt="More" width={16} height={16} />}
          </h2>
          {renderMenuItems(othersItems, 'others')}
        </nav>

        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;
