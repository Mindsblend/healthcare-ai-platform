'use client'

import { use } from 'react'
import Image from 'next/image'

import LoadingBar from '@/components/layout/LoadingBar'
import { useHealthAssessmentResult } from '@/features/shop/hooks/health/useHealthAssessmentResult'
import Link from 'next/link'

type Props = {
  params: Promise<{
    id: string
  }>
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
          <div className="flex flex-col-reverse items-center gap-15 text-center sm:gap-10 lg:flex-row lg:justify-between lg:text-right">
            <div>
              <h1 className="font-aria text-4xl font-extrabold text-black sm:text-5xl lg:text-6xl">
                نتیجه تحلیل سلامت شما
              </h1>
              <p className="font-ray mt-6 max-w-2xl text-base font-medium text-[#555] sm:text-lg lg:text-lg">
                {data.aiSummary}
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div
                className="relative flex items-center justify-center"
                style={{ width: size, height: size }}
              >
                <svg width={size} height={size} className="-rotate-90">
                  {/* Background */}
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#e5e7eb"
                    strokeWidth={strokeWidth}
                    fill="none"
                  />

                  {/* Progress */}
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

                {/* Center Content */}
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

          <div className="mt-24 flex flex-col items-center justify-center text-center lg:mt-36">
            <div>
              <h1 className="font-aria mb-6 text-4xl font-extrabold text-black sm:text-5xl lg:text-6xl">
                اعداد واقعی پشت احساسات روزانه تو
              </h1>

              <p className="font-ray mt-6 max-w-4xl text-lg font-medium text-[#555]">
                {data.aiSummary}
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-25 xl:grid-cols-3">
              <div className="space-y-3.5 rounded-[10px] bg-[#F2F2F2] px-6.25 py-7 text-black">
                <h1 className="font-aria text-2xl font-extrabold">
                  علائم فیزیکی
                </h1>
                <p className="font-ray text-sm font-medium">
                  تو خستگی مزمن را تأیید کردی؛ همان خستگی که حتی بعد از خواب
                  کافی هم رهایت نمی‌کند. گفتی که روزانه کمتر از ۱۵ دقیقه نور
                  خورشید می‌بینی. هوش مصنوعی ما این دو نشانه را کنار هم قرار داد
                  و طبق داده‌های پزشکی، در ۸۵ درصد موارد چنین ترکیبی به کمبود
                  ویتامین D3 ختم می‌شود.
                </p>
              </div>
              <div className="space-y-3.5 rounded-[10px] bg-[#F2F2F2] px-6.25 py-7 text-black">
                <h1 className="font-aria text-2xl font-extrabold">
                  سبک زندگی تو
                </h1>
                <p className="font-ray text-sm font-medium">
                  تو خستگی مزمن را تأیید کردی؛ همان خستگی که حتی بعد از خواب
                  کافی هم رهایت نمی‌کند. گفتی که روزانه کمتر از ۱۵ دقیقه نور
                  خورشید می‌بینی. هوش مصنوعی ما این دو نشانه را کنار هم قرار داد
                  و طبق داده‌های پزشکی، در ۸۵ درصد موارد چنین ترکیبی به کمبود
                  ویتامین D3 ختم می‌شود.
                </p>
              </div>
              <div className="space-y-3.5 rounded-[10px] bg-[#F2F2F2] px-6.25 py-7 text-black">
                <h1 className="font-aria text-2xl font-extrabold">
                  مقایسه پرونده های مشابه
                </h1>
                <p className="font-ray text-sm font-medium">
                  تو خستگی مزمن را تأیید کردی؛ همان خستگی که حتی بعد از خواب
                  کافی هم رهایت نمی‌کند. گفتی که روزانه کمتر از ۱۵ دقیقه نور
                  خورشید می‌بینی. هوش مصنوعی ما این دو نشانه را کنار هم قرار داد
                  و طبق داده‌های پزشکی، در ۸۵ درصد موارد چنین ترکیبی به کمبود
                  ویتامین D3 ختم می‌شود.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-24 lg:mt-36">
            <div className="flex flex-col items-center justify-center text-center">
              <h1 className="font-aria text-4xl font-extrabold text-black sm:text-5xl lg:text-6xl">
                برنامه شخصی‌سازی‌شده سلامتی شما
              </h1>

              <p className="font-ray mt-6 max-w-2xl text-lg font-medium text-[#555]">
                {data.aiDiagnosis}
              </p>
            </div>
            <div className="mt-17.5 rounded-[10px] bg-[#F2F2F2] p-10 text-black">
              <div className="font-aria flex h-10 w-28 items-center justify-center rounded-[5px] bg-black text-lg font-bold text-white sm:h-12 sm:w-36 sm:text-2xl">
                هفته اول
              </div>
              <div className="mt-8">
                <h1 className="font-aria text-2xl font-bold sm:text-3xl lg:text-4xl">
                  پایه‌گذاری کیفیت خواب و انرژی صبحگاهی
                </h1>
                <p className="font-ray mt-6 text-base leading-8 font-medium text-[#555] lg:text-lg">
                  بر اساس داده‌های ورودی شما، مشاهده شده که زمان خواب شما نامنظم
                  است و کیفیت خواب عمیق و REM شما کمتر از سطح بهینه است. این
                  موضوع باعث می‌شود بدن شما فرصت کافی برای ریکاوری نداشته باشد و
                  صبح‌ها با انرژی کمتر بیدار شوید، در حالی که ذهن شما همچنان در
                  حالت فعال و کمی پراکنده قرار دارد. این هفته تمرکز ما بر تنظیم
                  چرخه خواب و افزایش انرژی صبحگاهی است. برای شروع، پیشنهاد
                  می‌کنیم ۳۰ دقیقه زودتر از ساعت معمول بخوابید و یک ساعت قبل از
                  خواب تمام وسایل دیجیتال را خاموش کنید. علاوه بر این، ایجاد
                  محیط خواب تاریک و آرام، استفاده از بالش و تشک مناسب و کنترل
                  دمای اتاق به تثبیت چرخه خواب شما کمک می‌کند. در طول این هفته،
                  سطح انرژی خود را هر صبح از ۱ تا ۱۰ ثبت کنید و علائم خستگی،
                  حواس‌ پرتی یا خواب‌آلودگی را یادداشت کنید. این داده‌ها به ما
                  کمک می‌کنند هفته بعد توصیه‌ها را دقیق‌تر و متناسب با نیاز
                  واقعی بدن شما تنظیم کنیم. برای حمایت از بدن در مرحله اولیه،
                  دمنوش گیاهی آرامش‌بخش ارگانیک می‌تواند بسیار مؤثر باشد. این
                  دمنوش نه تنها باعث آرامش ذهن قبل از خواب می‌شود، بلکه ترکیبات
                  طبیعی آن به تثبیت چرخه خواب عمیق کمک می‌کند و اثرات مثبت آن
                  معمولاً ظرف دو تا سه شب قابل لمس است. همچنین، پیشنهاد می‌کنیم
                  سطح ویتامین D و منیزیم خود را بررسی کنید، زیرا کمبود این مواد
                  مغذی می‌تواند دلیل اصلی کاهش کیفیت خواب و ضعف انرژی صبحگاهی
                  باشد. با این اقدامات ساده اما دقیق، بدن شما فرصت بازسازی پیدا
                  می‌کند و در طول روز، تمرکز و کارایی ذهنی شما به شکل محسوسی
                  افزایش می‌یابد. این هفته پایه‌ای برای ایجاد عادات پایدار در
                  طول ماه‌های آینده است و موفقیت در این مرحله، مسیر شما را برای
                  مدیریت بهتر استرس و انرژی در هفته‌های بعد هموار می‌کند.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-24 flex flex-col items-center justify-center text-center lg:mt-36">
            <div>
              <h1 className="font-aria text-4xl font-extrabold text-black sm:text-5xl lg:text-6xl">
                آینده شما در انتظار تصمیم امروز
              </h1>
              <p className="font-ray mt-6 max-w-4xl text-base font-medium text-[#555] lg:text-lg">
                اگر همین روند را ادامه دهی، بدنت فرصت‌های طبیعی بازسازی را از
                دست می‌دهد. خواب نامنظم، انرژی پایین، تغذیه ناکافی و استرس
                پنهان، مثل یک سنگ کوچک در کف رودخانه است که به مرور جریان زندگی
                را کند و تاریک می‌کند. اما خبر خوب این است: از همین امروز
                می‌توانی مسیر را عوض کنی. حتی اقدامات کوچک و متمرکز، بدن و ذهنت
                را در مسیر بهترین عملکرد قرار می‌دهد.
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
