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
  const summary = data?.aiSummary || ''
  const diagnosis = data?.aiDiagnosis || ''
  const goals = data?.aiGoals || []
  const archetype = data?.healthArchetype || 'The Busy Achiever'
  const readiness = data?.readinessStage || 'Preparation'
  // New causal fields (may be undefined if not yet in DB)
  const keyInsight = (data as any)?.keyInsight || ''
  const causalChain = Array.isArray(data?.causalChain) ? data.causalChain : []

  const chekcCircle = [
    { title: 'انرژی پایدارتر در طول روز' },
    { title: 'تمرکز و عملکرد ذهنی بهتر' },
    { title: 'حفظ آسان‌تر عادت‌های سالم' },
    { title: 'انرژی پایدارتر در طول روز' },
  ]

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
                    {keyInsight ||
                      'تمرکز روی یک نقطه اهرمی، کل سیستم را به تعادل نزدیک می‌کند.'}
                  </p>
                  {causalChain.length > 0 && (
                    <div className="mt-2 text-xs text-gray-500">
                      {causalChain[0]}
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
                  {goals.length > 0 ? (
                    <>
                      <p className="font-ray text-sm leading-6 font-medium">
                        {goals[0].goal}
                      </p>
                      <p className="text-xs text-gray-500">
                        حوزه: {getDomainName(goals[0].domain)}
                      </p>
                    </>
                  ) : (
                    <p className="font-ray text-sm leading-6 font-medium">
                      هر روز ۱۰ دقیقه پیاده‌روی آرام
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

          {/* Domain Highlights & Archetype Cards */}

          {/* Personalized 3‑Goal Plan (Week 1) */}
          <div className="mt-24 lg:mt-36">
            <div className="flex flex-col items-center justify-center text-center">
              <h1 className="font-aria text-4xl font-extrabold text-black sm:text-5xl lg:text-6xl">
                درک عمیق‌تر از عوامل کلیدی سلامت شما
              </h1>

              <p className="font-ray mt-6 max-w-2xl text-lg font-medium text-[#555]">
                {diagnosis.length > 120
                  ? diagnosis.slice(0, 120) + '...'
                  : diagnosis}
              </p>
            </div>

            <div className="mt-17.5 rounded-[10px] bg-[#F2F2F2] p-10 text-black">
              <div className="font-aria flex h-10 w-28 items-center justify-center rounded-[5px] bg-black text-lg font-bold text-white sm:h-12 sm:w-45 sm:text-2xl">
                عامل کلیدی {activeIndex + 1}
              </div>

              <div className="mt-8">
                {goals.length > 0 ? (
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
                    {goals.map((goal, idx) => (
                      <SwiperSlide key={idx}>
                        <div>
                          <div>
                            <h1 className="font-aria text-4xl font-bold">
                              ?{goal.goal}
                            </h1>
                            <p className="font-ray mt-6 text-lg leading-8 font-medium text-[#555]">
                              مطالعات گسترده در حوزه خواب نشان می‌دهند که خواب
                              کمتر از ۷ ساعت در شب به‌طور مداوم با افزایش ریسک
                              اختلالات متابولیک، کاهش حساسیت انسولین، افزایش وزن
                              و افت عملکرد شناختی همراه است. در سطح عصبی، خواب
                              مرحله‌ای است که در آن مغز نه‌تنها استراحت می‌کند،
                              بلکه اطلاعات روز را تثبیت، خاطرات را سازمان‌دهی و
                              شبکه‌های عصبی را بازتنظیم می‌کند. در طول خواب
                              عمیق، سیستم گلیمفاتیک مغز فعال‌تر می‌شود و به
                              پاک‌سازی مواد زائد متابولیک کمک می‌کند؛ فرآیندی که
                              برای عملکرد شناختی پایدار ضروری است. هم‌زمان،
                              هورمون‌هایی مانند کورتیزول و لپتین تنظیم می‌شوند
                              که نقش مستقیم در استرس، اشتها و تعادل انرژی دارند.
                              به همین دلیل حتی اختلالات کوچک در کیفیت خواب
                              می‌توانند اثرات گسترده‌ای بر رفتار روزانه ایجاد
                              کنند. وقتی این سیستم دچار اختلال می‌شود، بدن
                              به‌صورت تدریجی وارد حالت “جبران انرژی” می‌شود؛
                              یعنی برای حفظ عملکرد روزانه، از منابع بیشتری
                              استفاده می‌کند اما بازسازی کافی انجام نمی‌شود.
                              نتیجه این وضعیت معمولاً به شکل نوسان انرژی، کاهش
                              تمرکز، افزایش ولع غذایی و کاهش تحمل استرس ظاهر
                              می‌شود. در مقابل، بهبود خواب یکی از قوی‌ترین نقاط
                              اهرمی در کل سیستم سلامت است. با پایدار شدن چرخه
                              خواب، نه‌تنها انرژی روزانه یکنواخت‌تر می‌شود، بلکه
                              تنظیم اشتها، کیفیت تصمیم‌گیری و توانایی بدن برای
                              ریکاوری نیز به‌صورت هم‌زمان بهبود پیدا می‌کند. در
                              عمل، خواب یکی از معدود عوامل مرکزی است که تقریباً
                              تمام سیستم‌های بدن را به‌صورت مستقیم یا غیرمستقیم
                              تحت تأثیر قرار می‌دهد.
                            </p>
                          </div>

                          <div className="font-ray mt-1 text-sm text-gray-600">
                            حوزه: {getDomainName(goal.domain)} • اولویت{' '}
                            {goal.priority}
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <div className="font-ray mt-6 text-gray-600">
                    بر اساس ارزیابی شما، به زودی برنامه دقیق‌تری ارائه خواهد شد.
                  </div>
                )}

                {/* Custom Pagination */}
                <div className="custom-pagination2 mt-6 flex justify-center gap-2" />

                <p className="font-ray mt-8 text-base font-medium text-[#555]">
                  این سه گام ساده، چرخه انرژی-بازیابی را در ۷ روز متحول می‌کنند.
                  هر روز یک مورد را انجام بده و پیشرفت خود را ثبت کن.
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
            <div className="items-centers mt-10 flex justify-center gap-3.25 max-sm:flex-wrap">
              {chekcCircle.map((circle, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-center gap-3.25 text-black max-sm:flex-col"
                >
                  <h1 className="font-aria text-base font-bold xl:text-2xl">
                    {circle.title}
                  </h1>
                  <Image
                    src="/images/arrow_back.svg"
                    alt="left arrow"
                    width={24}
                    height={24}
                    className="max-sm:-rotate-90"
                  />
                </div>
              ))}
            </div>
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
              <h1 className="font-aria text-2xl font-extrabold">
                خواب و ریکاوری
              </h1>
              <p className="font-ray mt-2 max-w-4xl text-center text-base font-medium text-[#555] lg:text-lg">
                خواب فقط زمانی برای استراحت نیست؛ بلکه یکی از مهم‌ترین فرایندهای
                بازسازی بدن محسوب می‌شود. در طول خواب، مغز اطلاعات را پردازش
                می‌کند، سیستم ایمنی تقویت می‌شود، هورمون‌ها تنظیم می‌شوند و بدن
                فرصت بازسازی عمیق پیدا می‌کند. کیفیت خواب مستقیماً بر سطح انرژی،
                تمرکز، خلق‌وخو و توانایی بدن برای حفظ تعادل فیزیولوژیک تأثیر
                می‌گذارد.
              </p>
            </div>
          </div>

          {/* Future Projection + CTA */}
          <div className="mt-24 flex flex-col items-center justify-center text-center lg:mt-36">
            <div>
              <h1 className="font-aria text-4xl font-extrabold text-black sm:text-5xl lg:text-6xl">
                آینده شما در انتظار تصمیم امروز
              </h1>
              <p className="font-ray mt-6 max-w-4xl text-base font-medium text-[#555] lg:text-lg">
                {keyInsight
                  ? keyInsight
                  : 'اگر همین روند را ادامه دهی، بدنت فرصت‌های طبیعی بازسازی را از دست می‌دهد. اما با یک تغییر کوچک و متمرکز، ظرف ۱۰ روز تعادل را تجربه خواهی کرد.'}
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
