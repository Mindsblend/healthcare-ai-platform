'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { ReactElement, SVGProps } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

/* =========================================================
   TYPES
========================================================= */

type IconComponent = (props: SVGProps<SVGSVGElement>) => ReactElement

interface HeroCategory {
  id: string
  label: string
  href: string
  icon: IconComponent
}

interface ShopHeroSectionProps {
  userName?: string
  savingsAmount?: number
  freeShippingThreshold?: number
  discountedProductsHref?: string
  guaranteesHref?: string
  categories?: HeroCategory[]
}

/* =========================================================
   HELPERS
========================================================= */

// ۴۵٬۶۰۰٬۰۰۰ (ارقام و جداکننده‌ی فارسی)
const toPersianDigits = (value: number) => value.toLocaleString('fa-IR')

const CARD_BASE = 'flex h-full w-full flex-col rounded-[30px] p-5 sm:p-6'

const CTA_CLASS =
  'font-aria mt-auto flex min-h-[50px] items-center justify-center rounded-[17px] bg-[#161A1D] p-2 text-center text-sm font-medium text-white transition-all duration-200 hover:bg-[#262A2E] active:scale-[0.99] sm:text-[15px]'

/* =========================================================
   DEFAULT DATA
========================================================= */

const defaultCategories: HeroCategory[] = [
  {
    id: 'protein',
    label: 'پروتئین',
    href: '/products?category=protein',
    icon: ProteinIcon,
  },
  {
    id: 'sleep',
    label: 'خواب',
    href: '/products?category=sleep',
    icon: SleepIcon,
  },
  {
    id: 'energy',
    label: 'انرژی',
    href: '/products?category=energy',
    icon: EnergyIcon,
  },
  {
    id: 'skin',
    label: 'پوست',
    href: '/products?category=skin',
    icon: SkinIcon,
  },
  {
    id: 'hair',
    label: 'سلامت مو',
    href: '/products?category=hair',
    icon: HairIcon,
  },
  {
    id: 'immunity',
    label: 'ایمنی بدن',
    href: '/products?category=immunity',
    icon: ImmunityIcon,
  },
]

/* =========================================================
   CARDS
========================================================= */

function SavingsCard({
  savingsAmount,
  freeShippingThreshold,
  href,
}: {
  savingsAmount: number
  freeShippingThreshold: number
  href: string
}) {
  return (
    <div className={`${CARD_BASE} bg-[#F2F2F2]`}>
      <div className="mb-1 flex h-9 w-9 items-center justify-center">
        <Image
          src="/images/coin.svg"
          width={35}
          height={35}
          alt=""
          aria-hidden="true"
          className="h-[35px] w-[35px]"
        />
      </div>

      <p className="font-aria mt-1 text-base leading-7 font-medium text-[#555555] sm:text-[17px]">
        سود شما با خرید از ما
      </p>

      <p className="font-aria mt-0.5 text-[26px] leading-[1.5] font-extrabold tracking-[-0.5px] text-black sm:mb-6 sm:text-[32px]">
        {toPersianDigits(savingsAmount)} تومان
      </p>

      <div className="font-ray mb-2.5 flex min-h-[44px] items-center gap-2 rounded-[13px] bg-[#B1C8FF] px-3 py-2 text-[11px] leading-5 font-bold text-black sm:text-[12px]">
        <TruckIcon className="h-[18px] w-[18px] shrink-0" />
        <span>
          خرید های بالای {toPersianDigits(freeShippingThreshold)} تومان، رایگان
          ارسال میشود
        </span>
      </div>

      <Link href={href} className={CTA_CLASS}>
        مشاهده محصولات تخفیف خورده
      </Link>
    </div>
  )
}

function CategoriesCard({ categories }: { categories: HeroCategory[] }) {
  return (
    <div className={`${CARD_BASE} bg-[#161A1D]`}>
      <h2 className="font-aria mb-5 text-center text-[20px] leading-8 font-bold text-white sm:text-[22px]">
        دنبال حل چی می‌گردی؟
      </h2>

      {/* باکس‌ها با aspect-square هم‌اندازه‌ی ستون می‌شن و هیچ‌وقت سرریز نمی‌کنن */}
      <div className="grid flex-1 grid-cols-3 content-start gap-2.5 sm:gap-3">
        {categories.map(({ id, label, href, icon: Icon }) => (
          <Link
            key={id}
            href={href}
            className="group flex aspect-square w-full flex-col items-center justify-center rounded-[13px] bg-[#262A2E] text-center transition-all duration-200 hover:bg-[#30353A] active:scale-[0.98]"
          >
            <span className="mb-1.5 flex h-8 w-8 items-center justify-center text-white transition-transform duration-200 group-hover:-translate-y-0.5">
              <Icon className="h-[27px] w-[27px]" />
            </span>
            <span className="font-ray text-[12px] leading-5 font-bold text-white sm:text-[13px]">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

function GuaranteesCard({ href }: { href: string }) {
  return (
    <div className={`${CARD_BASE} bg-[#F2F2F2]`}>
      <h2 className="font-aria mb-5 text-[21px] font-bold text-[#1C1B1F] sm:text-[23px]">
        نگران اصالت کالا هستی؟
      </h2>

      <ul className="flex flex-col gap-[14px]">
        <li className="flex items-center gap-3">
          <ShieldIcon className="h-5 w-5 shrink-0 text-black" />
          <span className="font-ray text-sm font-medium text-[#555555]">
            ۱۰۰٪ اصالت کالا
          </span>
        </li>

        <li className="flex items-center gap-3">
          <span className="flex shrink-0 items-center justify-center rounded-full bg-[#262A2E] text-white">
            <CheckIcon className="h-5 w-5" />
          </span>
          <span className="font-ray text-sm font-medium text-[#555555]">
            دارای مجوز رسمی سازمان غذا و دارو
          </span>
        </li>

        <li className="flex items-center gap-3">
          <ReturnIcon className="h-5 w-5 shrink-0 text-black" />
          <span className="font-ray text-sm font-medium text-[#555555]">
            بازگشت رایگان تا ۷ روز
          </span>
        </li>
      </ul>

      <Link href={href} className={`${CTA_CLASS} mt-6`}>
        مشاهده ضمانت‌ها
      </Link>
    </div>
  )
}

/* =========================================================
   SECTION
========================================================= */

const ShopHeroSection = ({
  userName = 'کیان',
  savingsAmount = 45_600_000,
  freeShippingThreshold = 3_000_000,
  discountedProductsHref = '/products?filter=discounted',
  guaranteesHref = '/guarantees',
  categories = defaultCategories,
}: ShopHeroSectionProps = {}) => {
  const cards = [
    {
      id: 'savings',
      node: (
        <SavingsCard
          savingsAmount={savingsAmount}
          freeShippingThreshold={freeShippingThreshold}
          href={discountedProductsHref}
        />
      ),
    },
    { id: 'categories', node: <CategoriesCard categories={categories} /> },
    { id: 'guarantees', node: <GuaranteesCard href={guaranteesHref} /> },
  ]

  return (
    // موبایل/تبلت: تمام‌عرض و بدون پدینگ — از lg به بعد container
    <section className="mt-10 mb-8 w-full sm:mt-16 lg:container lg:mt-20">
      {/* Greeting */}
      <div className="mx-auto mb-8 flex max-w-3xl flex-col items-center px-4 text-center sm:mb-12">
        <h1 className="font-aria text-color-title-on-light text-[28px] leading-[1.5] font-extrabold sm:text-[34px] lg:text-[40px]">
          {userName} عزیز، خوش آمدی{' '}
          <span role="img" aria-label="دست تکان دادن" className="inline-block">
            👋
          </span>
        </h1>
      </div>

      {/* Mobile & tablet: Swiper */}
      <div className="lg:hidden">
        <Swiper
          dir="rtl"
          modules={[Pagination]}
          pagination={{ clickable: true }}
          slidesPerView="auto"
          centeredSlides
          initialSlide={1}
          spaceBetween={12}
          grabCursor
          className="!pb-9 [--swiper-pagination-bottom:0px] [--swiper-pagination-bullet-horizontal-gap:4px] [--swiper-pagination-bullet-inactive-color:#161A1D] [--swiper-pagination-bullet-inactive-opacity:0.2] [--swiper-pagination-bullet-size:8px] [--swiper-pagination-color:#161A1D]"
        >
          {cards.map(({ id, node }) => (
            <SwiperSlide
              key={id}
              className="!h-[260px] !w-[290px] sm:!w-[323px]"
            >
              {node}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop */}
      <div className="hidden items-stretch justify-center gap-5 lg:flex">
        {cards.map(({ id, node }) => (
          <div key={id} className="flex w-[323px]">
            {node}
          </div>
        ))}
      </div>
    </section>
  )
}

/* =========================================================
   CATEGORY ICONS
========================================================= */

function ProteinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14.8 14.8c-2.1 2.1-5.4 2.9-7.6.7-2.2-2.2-1.4-5.5.7-7.6 2.8-2.8 7.3-3.1 10-.4l.1.1c2.7 2.7 2.4 7.2-.4 10-1 1-1.8 2-1.8 3.1a1.9 1.9 0 1 1-3.7 0c0-1.1.7-2.1 1.7-3.1z"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.6" cy="9.6" r="1.1" fill="currentColor" />
    </svg>
  )
}

function SleepIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function EnergyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13 3 4 14h6l-1 7 9-11h-6l1-7z"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SkinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
      <path
        d="M18.3 15.2l.6 1.7 1.7.6-1.7.6-.6 1.7-.6-1.7-1.7-.6 1.7-.6z"
        stroke="currentColor"
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
    </svg>
  )
}

function HairIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6 20v-3.2c0-1 .3-1.9 1-2.6.4-.5.6-1.1.5-1.7C7 10.8 7 9 8.4 7.2 9.6 5.6 11.6 5 13.3 5.4c1 .2 1.7 1 2.6 1.5.8.5 1.8.6 2.6 1.4.9.9 1.2 2.3.8 3.5-.3.9-1 1.6-1 2.6V20"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 20v-2.4M12 20v-3M15 20v-2.4"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  )
}

function ImmunityIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </svg>
  )
}

/* =========================================================
   GENERAL ICONS
========================================================= */

function TruckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3 7h11v9H3z"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinejoin="round"
      />
      <path
        d="M14 10h4l3 3v3h-7z"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinejoin="round"
      />
      <circle
        cx="7"
        cy="17.5"
        r="1.6"
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <circle
        cx="17.5"
        cy="17.5"
        r="1.6"
        stroke="currentColor"
        strokeWidth={1.5}
      />
    </svg>
  )
}

function ShieldIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 3.5 19 6v5.1c0 4.3-2.7 7.7-7 9.4-4.3-1.7-7-5.1-7-9.4V6l7-2.5Z"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="m6.5 12.5 3.5 3.5 7.5-8"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ReturnIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8 7H5v3"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.2 10a7 7 0 1 1 1.9 7.4"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <path
        d="M8.5 13.5 6 17l3.5 2"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ShopHeroSection
