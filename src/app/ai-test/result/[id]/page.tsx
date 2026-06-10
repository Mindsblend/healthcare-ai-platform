'use client'

import { use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LoadingBar from '@/components/layout/LoadingBar'
import { useHealthAssessmentResult } from '@/features/shop/hooks/health/useHealthAssessmentResult'

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

  const percentage = data ? Math.min(Math.max(data.overallScore, 0), 100) : 0

  const size = 300
  const strokeWidth = 20
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const getScoreColor = () => {
    if (percentage >= 80) return '#22c55e'
    if (percentage >= 50) return '#eab308'
    return '#ef4444'
  }

  // Safely access AI analysis fields
  const summary = data?.aiSummary || ''
  const diagnosis = data?.aiDiagnosis || ''
  const goals = data?.aiGoals || []
  const archetype = data?.healthArchetype || 'The Busy Achiever'
  const readiness = data?.readinessStage || 'Preparation'
  // New causal fields (may be undefined if not yet in DB)
  const keyInsight = (data as any)?.keyInsight || ''
  const causalChain = (data as any)?.causalChain || []

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
          <div className="flex flex-col-reverse items-center gap-15 text-center sm:gap-10 lg:flex-row lg:justify-between lg:text-right">
            <div>
              <h1 className="font-aria text-4xl font-extrabold text-black sm:text-5xl lg:text-6xl">
                نتیجه تحلیل سلامت شما
              </h1>
              <p className="font-ray mt-6 max-w-2xl text-base font-medium text-[#555] sm:text-lg lg:text-lg">
                {summary}
              </p>
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
                    stroke={getScoreColor()}
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
          <div className="mt-24 flex flex-col items-center justify-center text-center lg:mt-36">
            <div>
              <h1 className="font-aria mb-6 text-4xl font-extrabold text-black sm:text-5xl lg:text-6xl">
                الگوی سیستم تو
              </h1>
              <p className="font-ray mt-6 max-w-4xl text-lg font-medium text-[#555]">
                {diagnosis}
              </p>
            </div>

            {/* Three cards: Key Insight, Archetype, Readiness */}
            <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-25 xl:grid-cols-3">
              {/* Key Insight Card */}
              <div className="space-y-3.5 rounded-[10px] bg-[#F2F2F2] px-6.25 py-7 text-right">
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
              <div className="space-y-3.5 rounded-[10px] bg-[#F2F2F2] px-6.25 py-7 text-right">
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
              <div className="space-y-3.5 rounded-[10px] bg-[#F2F2F2] px-6.25 py-7 text-right">
                <h1 className="font-aria text-2xl font-extrabold">اولین قدم</h1>
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

          {/* Personalized 3‑Goal Plan (Week 1) */}
          <div className="mt-24 lg:mt-36">
            <div className="flex flex-col items-center justify-center text-center">
              <h1 className="font-aria text-4xl font-extrabold text-black sm:text-5xl lg:text-6xl">
                برنامه شخصی‌سازی‌شده سلامتی شما
              </h1>
              <p className="font-ray mt-6 max-w-2xl text-lg font-medium text-[#555]">
                {diagnosis.length > 120
                  ? diagnosis.slice(0, 120) + '...'
                  : diagnosis}
              </p>
            </div>

            <div className="mt-17.5 rounded-[10px] bg-[#F2F2F2] p-10 text-black">
              <div className="font-aria flex h-10 w-28 items-center justify-center rounded-[5px] bg-black text-lg font-bold text-white sm:h-12 sm:w-36 sm:text-2xl">
                هفته اول
              </div>
              <div className="mt-8">
                <h1 className="font-aria text-2xl font-bold sm:text-3xl lg:text-4xl">
                  سه گام عملی برای شروع
                </h1>
                <div className="mt-6 space-y-4">
                  {goals.length > 0 ? (
                    goals.map((goal, idx) => (
                      <div
                        key={idx}
                        className="rounded-r-lg border-r-4 border-black bg-white/50 p-4"
                      >
                        <div className="font-aria text-lg font-bold">
                          گام {idx + 1}: {goal.goal}
                        </div>
                        <div className="font-ray mt-1 text-sm text-gray-600">
                          حوزه: {getDomainName(goal.domain)} • اولویت{' '}
                          {goal.priority}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="font-ray text-gray-600">
                      بر اساس ارزیابی شما، به زودی برنامه دقیق‌تری ارائه خواهد
                      شد.
                    </div>
                  )}
                </div>
                <p className="font-ray mt-8 text-base font-medium text-[#555]">
                  این سه گام ساده، چرخه انرژی-بازیابی را در ۷ روز متحول می‌کنند.
                  هر روز یک مورد را انجام بده و پیشرفت خود را ثبت کن.
                </p>
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
