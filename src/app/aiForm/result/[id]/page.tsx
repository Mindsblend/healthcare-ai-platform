'use client'

import { use } from 'react'
import Image from 'next/image'

import LoadingBar from '@/components/layout/LoadingBar'
import { useHealthAssessmentResult } from '@/features/shop/hooks/health/useHealthAssessmentResult'

type Props = {
  params: Promise<{
    id: string
  }>
}

const Page = ({ params }: Props) => {
  const { id } = use(params)

  const { data, loading, error } = useHealthAssessmentResult(id)

  if (!data) return null

  const score = data.overallScore
  const percentage = Math.min(Math.max(score, 0), 100)

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
    <LoadingBar loading={loading} error={error}>
      {!loading && !error && !data ? (
        <div>اطلاعات ارزیابی پیدا نشد</div>
      ) : data ? (
        <div className="container my-28 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-aria text-6xl font-extrabold text-black">
                نتیجه تحلیل سلامت شما
              </h1>
              <p className="font-ray mt-6 max-w-2xl text-lg font-medium text-[#555]">
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

          <div className="mt-44 flex flex-col items-center justify-center text-center">
            <div>
              <h1 className="font-aria mb-6 text-6xl font-extrabold text-black">
                اعداد واقعی پشت احساسات روزانه تو
              </h1>

              <p className="font-ray mt-6 max-w-4xl text-lg font-medium text-[#555]">
                {data.aiSummary}
              </p>
            </div>
            <div className="mt-17.75 grid grid-cols-3 gap-25">
              <div className="space-y-3.5 rounded-[10px] bg-[#F2F2F2] px-6.25 py-7 text-black">
                <h1 className="font-aria text-2xl font-extrabold">
                  علائم فیزیکی
                </h1>
                <p className="font-ray text-xs font-medium">
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
                <p className="font-ray text-xs font-medium">
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
                <p className="font-ray text-xs font-medium">
                  تو خستگی مزمن را تأیید کردی؛ همان خستگی که حتی بعد از خواب
                  کافی هم رهایت نمی‌کند. گفتی که روزانه کمتر از ۱۵ دقیقه نور
                  خورشید می‌بینی. هوش مصنوعی ما این دو نشانه را کنار هم قرار داد
                  و طبق داده‌های پزشکی، در ۸۵ درصد موارد چنین ترکیبی به کمبود
                  ویتامین D3 ختم می‌شود.
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex flex-col items-center justify-center text-center">
              <h1 className="font-aria mt-44 text-6xl font-extrabold text-black">
                برنامه شخصی‌سازی‌شده سلامتی شما
              </h1>

              <p className="font-ray mt-6 max-w-2xl text-lg font-medium text-[#555]">
                {data.aiDiagnosis}
              </p>
            </div>
            <div className="mt-17.5 rounded-[10px] bg-[#F2F2F2] p-10 text-black">
              <div className="font-aria flex h-12.5 w-35.5 items-center justify-center rounded-[5px] bg-black text-2xl font-bold text-white">
                هفته اول
              </div>
              <div className="mt-8">
                <h1 className="font-aria text-4xl font-bold">
                  پایه‌گذاری کیفیت خواب و انرژی صبحگاهی
                </h1>
                <p className="font-ray mt-6 text-lg font-medium text-[#555]">
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
          <div className="mt-44 flex flex-col items-center justify-center text-center">
            <div>
              <h1 className="font-aria text-6xl font-extrabold text-black">
                آینده شما در انتظار تصمیم امروز
              </h1>
              <p className="font-ray mt-6 max-w-4xl text-lg font-medium text-[#555]">
                اگر همین روند را ادامه دهی، بدنت فرصت‌های طبیعی بازسازی را از
                دست می‌دهد. خواب نامنظم، انرژی پایین، تغذیه ناکافی و استرس
                پنهان، مثل یک سنگ کوچک در کف رودخانه است که به مرور جریان زندگی
                را کند و تاریک می‌کند. اما خبر خوب این است: از همین امروز
                می‌توانی مسیر را عوض کنی. حتی اقدامات کوچک و متمرکز، بدن و ذهنت
                را در مسیر بهترین عملکرد قرار می‌دهد.
              </p>
            </div>
            <button className="font-aria primary-btn mt-6 flex items-center justify-center gap-2.75 rounded-[7px] bg-[#1A1A1A] text-lg font-bold text-white">
              شروع تغییر
              <Image
                src="/images/keyboard_return.svg"
                width={18}
                height={12}
                alt="keyboard return icon"
              />
            </button>
          </div>
        </div>
      ) : null}
    </LoadingBar>
  )
}

export default Page
