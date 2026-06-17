'use client'

import { use, useRef, useState, useMemo } from 'react'
import type { Swiper as SwiperType } from 'swiper'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import LoadingBar from '@/components/layout/LoadingBar'
import { useHealthAssessmentResult } from '@/features/shop/hooks/health/useHealthAssessmentResult'

import 'swiper/css'
import 'swiper/css/pagination'

type Props = {
  params: Promise<{ id: string }>
}

// Helper to get domain name in Persian
const getDomainName = (domain: string): string => {
  const names: Record<string, string> = {
    sleep: 'خواب',
    nutrition: 'تغذیه',
    activity: 'تحرک',
    stress: 'استرس',
    beauty: 'زیبایی',
    medical: 'پزشکی',
    energy: 'انرژی',
    behavioral: 'رفتاری',
  }
  return names[domain] || domain
}

// Helper to get archetype description
const getArchetypeDescription = (archetype: string): string => {
  const descriptions: Record<string, string> = {
    'The Stressed Overachiever':
      'تحت فشار عملکرد خوبی داری، اما ریکاوری گلوگاه سیستم توست.',
    'The Self-Care Seeker':
      'زیبایی و آرامش برایت مهم است، اما استرس گاهی مانع می‌شود.',
    'The Skeptical Beginner':
      'شک داری اما قدم اول را برداشته‌ای – همین کافی است.',
    'The Consistency Queen':
      'ثبات نقطه قوت توست – حالا بیا تأثیر آن را در تمام سیستم ببین.',
    'The Hopeful Restarter':
      'بارها شروع کرده‌ای – این بار با درک سیستم، متفاوت خواهد بود.',
    'The Burnout Candidate':
      'خستگی مزمن سیستم را قفل کرده – تمرکز روی بازیابی اولویت اول است.',
    'The Busy Achiever':
      'همیشه در حال انجام کاری – اما گاهی بدن نیاز به مکث دارد.',
  }
  return descriptions[archetype] || 'شناخت الگوی تو، کلید تغییر پایدار است.'
}

// Helper to get readiness stage in Persian
const getReadinessText = (stage: string): string => {
  const map: Record<string, string> = {
    Action: 'اقدام',
    Preparation: 'آماده‌سازی',
    Contemplation: 'تفکر',
    Maintenance: 'نگهداری',
  }
  return map[stage] || stage
}

const Page = ({ params }: Props) => {
  const { id } = use(params)
  const { data, loading, error } = useHealthAssessmentResult(id)
  const swiperRef = useRef<SwiperType | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const score = data?.overallScore ?? 0
  const percentage = Math.min(Math.max(score, 0), 100)

  const size = 300
  const strokeWidth = 20
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const scoreColor = useMemo(() => {
    if (percentage >= 80) return '#22c55e'
    if (percentage >= 50) return '#eab308'
    return '#ef4444'
  }, [percentage])

  // Safely access AI analysis fields
  const summary = data?.summary || ''
  const diagnosis = data?.diagnosis || ''
  const goals = data?.goals || []
  const mainBottleneck = (data as any)?.mainBottleneck
  const startingPoint = data?.startingPoint
  const priorityFactors = (data as any)?.priorityFactors || []
  const archetype = data?.healthArchetype || 'The Busy Achiever'
  const readiness = data?.readinessStage || 'Preparation'
  // New causal fields (may be undefined if not yet in DB)
  const insight = data?.keyInsight ?? ''
  const causalChain = Array.isArray(data?.causalChain) ? data.causalChain : []
  const chekcCircle = [
    { title: 'انرژی پایدارتر در طول روز' },
    { title: 'تمرکز و عملکرد ذهنی بهتر' },
    { title: 'حفظ آسان‌تر عادت‌های سالم' },
    { title: 'انرژی پایدارتر در طول روز' },
  ]

  console.log('startingPoint:', data?.startingPoint)

  return (
    <LoadingBar
      loading={loading}
      loadingText="در حال بارگذاری نتایج..."
      error={error}
    >
      {!data ? (
        <div>اطلاعات ارزیابی پیدا نشد</div>
      ) : (
        <div className="my-16 space-y-16 lg:my-28 lg:space-y-24">
          {/* Header: Score + Summary */}
          <div className="flex flex-col-reverse items-center gap-25 text-center">
            <div className="flex flex-col items-center justify-center text-center">
              <div>
                <h1 className="font-aria mb-6 text-4xl font-extrabold text-black sm:text-5xl lg:text-6xl">
                  تصویری از وضعیت فعلی سلامت شما
                </h1>
                <p className="font-ray mt-6 max-w-4xl text-base font-medium text-[#555] lg:text-lg">
                  {diagnosis}
                </p>
              </div>

              {/* Three cards: Key Insight, Archetype, Readiness */}
              <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-25 xl:grid-cols-3">
                {/* Key Insight Card */}
                <div className="space-y-3.5 rounded-[10px] bg-[#F2F2F2] px-6.25 py-7 text-right text-black">
                  <h1 className="font-aria text-2xl font-extrabold">
                    نقطه اهرمی
                  </h1>
                  <p className="font-ray text-sm leading-6 font-medium">
                    {insight.length > 0
                      ? insight
                      : 'تمرکز روی یک نقطه اهرمی، کل سیستم را به تعادل نزدیک می‌کند.'}
                  </p>
                  {causalChain.length > 0 && (
                    <div className="mt-3 text-xs text-gray-500">
                      {causalChain.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span>{item}</span>

                          {idx < causalChain.length - 1 && (
                            <span className="text-gray-400">→</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Archetype Card */}
                <div className="space-y-3.5 rounded-[10px] bg-[#F2F2F2] px-6.25 py-7 text-right text-black">
                  <h1 className="font-aria text-2xl font-extrabold">
                    الگوی رفتاری
                  </h1>

                  <p className="font-aria text-xl font-bold text-black">
                    {archetype.replace(/^The /, '')}
                  </p>

                  {/* جایگزین description استاتیک */}
                  <p className="font-ray text-sm leading-6 font-medium">
                    {getArchetypeDescription(archetype)}
                  </p>

                  <div className="mt-2 inline-block rounded-full bg-white/50 px-3 py-1 text-xs font-medium text-gray-600">
                    مرحله {getReadinessText(readiness)}
                  </div>
                </div>

                {/* Suggested First Step (from goals) */}
                <div className="space-y-3.5 rounded-[10px] bg-[#F2F2F2] px-6.25 py-7 text-right text-black">
                  <h1 className="font-aria text-2xl font-extrabold">
                    اولین قدم
                  </h1>
                  {startingPoint ? (
                    <>
                      <h1 className="font-aria text-2xl font-extrabold">
                        {startingPoint.title}
                      </h1>

                      <p className="font-ray mt-3 text-base text-[#555]">
                        {startingPoint.description}
                      </p>

                      <div className="mt-4">
                        <h2 className="font-ray text-sm font-semibold text-black">
                          اولین اقدام:
                        </h2>

                        <p className="font-ray mt-1 text-sm text-[#555]">
                          {startingPoint.firstAction}
                        </p>
                      </div>

                      {startingPoint.expectedBenefits?.length > 0 && (
                        <div className="mt-4">
                          <h2 className="font-ray text-sm font-semibold text-black">
                            نتایج احتمالی:
                          </h2>

                          <ul className="mt-2 space-y-1">
                            {startingPoint.expectedBenefits.map((b, i) => (
                              <li key={i} className="text-sm text-[#555]">
                                • {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="font-ray text-sm text-[#555]">
                      در حال آماده‌سازی مسیر شروع شما...
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div
                className="relative flex items-center justify-center"
                style={{ width: size, height: size }}
              >
                <svg width={size} height={size} className="-rotate-90">
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#e5e7eb"
                    strokeWidth={strokeWidth}
                    fill="none"
                  />
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={scoreColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-aria text-7xl leading-none font-extrabold text-black">
                    {percentage}
                  </span>
                  <span className="font-ray mt-2 text-base text-zinc-500">
                    امتیاز سلامت
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-24 lg:mt-36">
            <div className="flex flex-col items-center justify-center text-center">
              <h1 className="font-aria text-4xl font-extrabold text-black sm:text-5xl lg:text-6xl">
                درک عمیق‌تر از عوامل کلیدی سلامت شما
              </h1>

              <p className="font-ray mt-6 max-w-2xl text-lg font-medium text-[#555]">
                {data?.mainBottleneck?.explanation ||
                  diagnosis ||
                  'در حال تحلیل عمیق سیستم سلامت شما...'}
              </p>
            </div>

            <div className="mt-17.5 rounded-[10px] bg-[#F2F2F2] p-10 text-black">
              <div className="font-aria flex h-10 w-28 items-center justify-center rounded-[5px] bg-black text-lg font-bold text-white sm:h-12 sm:w-45 sm:text-2xl">
                عامل کلیدی {activeIndex + 1}
              </div>

              <div className="mt-8">
                {priorityFactors.length > 0 ? (
                  <Swiper
                    onSwiper={(swiper) => {
                      swiperRef.current = swiper
                    }}
                    onSlideChange={(swiper) => {
                      setActiveIndex(swiper.activeIndex)
                    }}
                    modules={[Autoplay, Pagination]}
                    spaceBetween={24}
                    speed={700}
                    grabCursor
                    watchOverflow
                    autoplay={{
                      delay: 5000,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                    }}
                    pagination={{
                      clickable: true,
                      el: '.custom-pagination2',
                    }}
                    breakpoints={{
                      0: { slidesPerView: 1, spaceBetween: 16 },
                      640: { slidesPerView: 1, spaceBetween: 20 },
                      1024: { slidesPerView: 1, spaceBetween: 24 },
                    }}
                    className="mt-6 w-full pb-10"
                  >
                    {priorityFactors.map((factor: any, idx: number) => (
                      <SwiperSlide key={idx}>
                        <div>
                          {/* TITLE */}
                          <div>
                            <h1 className="font-aria text-3xl font-bold">
                              {factor.title}
                            </h1>

                            {/* SYSTEM IMPACT */}
                            <p className="font-ray mt-5 text-lg leading-8 font-medium text-[#555]">
                              {factor.systemImpact}
                            </p>

                            {/* PERSONAL IMPACT */}
                            <p className="font-ray mt-4 text-base leading-7 text-gray-600">
                              {factor.personalImpact}
                            </p>
                          </div>

                          {/* META */}
                          <div className="font-ray mt-4 text-sm text-gray-600">
                            حوزه: {getDomainName(factor.domain)} • اولویت{' '}
                            {factor.priority}
                          </div>

                          {/* MICRO ACTION (CRITICAL UX ELEMENT) */}
                          <div className="mt-6 rounded-md bg-white px-4 py-3 text-sm font-medium text-black">
                            🎯 اقدام ۱۰ دقیقه‌ای: {factor.microAction}
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <div className="font-ray mt-6 text-gray-600">
                    در حال آماده‌سازی تحلیل عوامل کلیدی سیستم شما...
                  </div>
                )}

                {/* Pagination */}
                <div className="custom-pagination2 mt-6 flex justify-center gap-2" />

                <p className="font-ray mt-8 text-base font-medium text-[#555]">
                  این عوامل، اهرم‌های اصلی تغییر سیستم سلامت شما هستند. تمرکز
                  روی همین سه نقطه می‌تواند کل سیستم را متحول کند.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-24 flex flex-col items-center justify-center lg:mt-36">
            <div className="flex flex-col items-center justify-center text-center">
              <h1 className="font-aria text-4xl font-extrabold text-black sm:text-5xl lg:text-6xl">
                کدام عامل بیشترین تأثیر را بر سلامت شما دارد؟
              </h1>
              <p className="font-ray mt-6 max-w-4xl text-base font-medium text-[#555] lg:text-lg">
                سلامت بدن به‌صورت مجموعه‌ای از عوامل مستقل عمل نمی‌کند. بسیاری
                از چالش‌هایی که امروز تجربه می‌کنید، در واقع به یکدیگر متصل
                هستند و می‌توانند به شکل یک زنجیره بر کیفیت زندگی شما اثر
                بگذارند. به همین دلیل، همه عوامل تأثیر یکسانی ندارند. برخی از
                آن‌ها نقش محوری‌تری در سیستم سلامت ایفا می‌کنند و بهبود آن‌ها
                می‌تواند به‌صورت هم‌زمان چندین بخش دیگر را نیز تحت تأثیر قرار
                دهد.
              </p>
            </div>
            {mainBottleneck && (
              <div className="mt-10 flex flex-col items-center justify-center text-center">
                <h1 className="font-aria text-2xl font-bold text-black">
                  {mainBottleneck.title}
                </h1>

                <p className="font-ray mt-3 max-w-3xl text-base text-gray-700">
                  {mainBottleneck.explanation}
                </p>

                <div className="mt-10 flex flex-wrap justify-center gap-4">
                  {(mainBottleneck.affectedAreas ?? []).map(
                    (area: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-black"
                      >
                        <Image
                          src="/images/check-circle.svg"
                          alt="check"
                          width={24}
                          height={24}
                        />
                        <span className="font-ray text-lg font-medium">
                          {area}
                        </span>
                      </div>
                    ),
                  )}
                </div>

                <h2 className="mt-10 font-bold text-black">
                  اگر این گلوگاه بهبود پیدا کند
                </h2>

                <p className="mt-4 max-w-2xl text-gray-700">
                  {mainBottleneck.leverageReason}
                </p>
              </div>
            )}

            <h1 className="font-aria mt-20 text-2xl font-bold text-black">
              اگر این گلوگاه بهبود پیدا کند
            </h1>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              {chekcCircle.map((circle, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-center gap-1.5 text-black"
                >
                  <Image
                    src="/images/check-circle.svg"
                    alt="check circle icon"
                    width={24}
                    height={24}
                  />
                  <h1 className="font-ray text-lg font-medium">
                    {circle.title}
                  </h1>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="text-center">
              <h1 className="font-aria text-4xl font-extrabold text-black sm:text-5xl lg:text-6xl">
                بهترین مسیر برای شروع تغییر
              </h1>
              <p className="font-ray mt-6 max-w-4xl text-base font-medium text-[#555] lg:text-lg">
                تا اینجا، سیستم سلامت شما به‌صورت کامل تحلیل شد و مشخص شد که
                برخی عوامل نسبت به سایر بخش‌ها نقش مرکزی‌تری در وضعیت فعلی شما
                دارند. بر اساس این الگوها، یک مسیر بهینه برای شروع تغییر شناسایی
                شده است؛ مسیری که بیشترین احتمال را برای ایجاد بهبود زنجیره‌ای
                در کل سیستم سلامت شما دارد.
              </p>
            </div>
            <div className="mt-10 flex max-w-88.25 flex-col items-center justify-center space-y-3.5 rounded-[10px] bg-[#F2F2F2] px-7.5 py-5 text-black">
              <Image
                src="/images/goal.svg"
                alt="goal icon"
                width={30}
                height={30}
              />
              <div className="flex flex-col items-center justify-center">
                {/* Dynamic Starting Point Card */}
                {startingPoint ? (
                  <div className="mt-10 flex max-w-88.25 flex-col items-center justify-center space-y-3.5 rounded-[10px] bg-[#F2F2F2] px-7.5 py-5 text-center text-black">
                    {/* Title */}
                    <h1 className="font-aria text-2xl font-extrabold">
                      {startingPoint.title}
                    </h1>

                    {/* Description */}
                    <p className="font-ray mt-2 text-base font-medium text-[#555]">
                      {startingPoint.description}
                    </p>

                    {/* Expected benefits */}
                    {startingPoint.expectedBenefits?.length > 0 && (
                      <div className="mt-4 w-full text-right">
                        <h3 className="font-aria mb-2 text-lg font-bold">
                          نتایج احتمالی
                        </h3>

                        <ul className="space-y-2">
                          {startingPoint.expectedBenefits.map(
                            (benefit: string, idx: number) => (
                              <li
                                key={idx}
                                className="font-ray flex items-start gap-2 text-sm text-[#555]"
                              >
                                <span className="text-green-500">•</span>
                                {benefit}
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}

                    {/* First action (MOST IMPORTANT CTA) */}
                    <div className="mt-4 w-full rounded-md bg-white px-4 py-3 text-right">
                      <h3 className="font-aria mb-1 text-lg font-bold">
                        اولین اقدام
                      </h3>
                      <p className="font-ray text-sm text-[#333]">
                        {startingPoint.firstAction}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-10 text-gray-500">
                    در حال آماده‌سازی مسیر شروع...
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Future Projection + CTA */}
          <div className="mt-24 flex flex-col items-center justify-center text-center lg:mt-36">
            <div>
              <h1 className="font-aria text-4xl font-extrabold text-black sm:text-5xl lg:text-6xl">
                آینده شما در انتظار تصمیم امروز
              </h1>
              <p className="font-ray mt-6 max-w-4xl text-base font-medium text-[#555] lg:text-lg">
                ...
              </p>
            </div>
            <Link
              href="/products"
              className="font-aria primary-btn mt-6 flex items-center justify-center gap-2.75 rounded-[7px] bg-[#1A1A1A] text-lg font-bold text-white"
            >
              شروع تغییر
              <Image
                src="/images/keyboard_return.svg"
                width={18}
                height={12}
                alt="keyboard return icon"
              />
            </Link>
          </div>
        </div>
      )}
    </LoadingBar>
  )
}

export default Page
