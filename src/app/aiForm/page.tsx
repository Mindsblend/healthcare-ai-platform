'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useHealthAssessment } from '@/features/shop/hooks/health/useHealthAssessment'
import { motion, AnimatePresence } from 'framer-motion'

interface Question {
  id: number
  title: string
  prompt: string
  options?: string[]
}

type Direction = 1 | -1

interface Answers {
  [key: number]: string
}

const Page = () => {
  const questions: Question[] = [
    {
      id: 1,
      title: 'به تست سلامت هوشمند خوش آمدید',
      prompt:
        'این تست نتیجه‌ی ترکیب دو دنیا است: از یک طرف، دانش ارزشمند و هزارساله‌ی طب سنتی ایرانی که ریشه در شناخت عمیق بدن و تعادل مزاج‌ها دارد، و از طرف دیگر، قدرت بی‌نظیر تحلیل داده‌ها توسط هوش مصنوعی. با پاسخ دادن دقیق به پرسش‌ها، الگوریتم هوشمند ما می‌تواند تصویر روشنی از وضعیت بدنی شما ترسیم کند و گزارشی شخصی‌سازی‌شده به شما ارائه دهد. این گزارش شامل تیپ بدنی شما، توصیه‌های غذایی متناسب، پیشنهادهایی برای سبک زندگی و حتی نکاتی درباره پیشگیری از مشکلات احتمالی در آینده خواهد بود. هرچه پاسخ‌های شما جزئی‌تر و دقیق‌تر باشد، نتیجه نهایی واقعی‌تر و کاربردی‌تر خواهد شد. این تست فقط یک پرسشنامه ساده نیست؛ بلکه یک راهنماست که می‌تواند در عرض چند دقیقه به شما بینشی بدهد که بسیاری افراد برای به‌دست آوردنش ماه‌ها وقت و هزینه صرف می‌کنند. به یاد داشته باشید: تکمیل این تست کمتر از ۳ دقیقه طول می‌کشد، اما بینشی که دریافت می‌کنید می‌تواند مسیر جدیدی برای سلامتی، انرژی و آرامش شما در سال‌های آینده بسازد.',
    },
    {
      id: 1,
      title: 'معمولاً چند ساعت در شب می‌خوابید؟',
      prompt: 'SL1 – مدت زمان خواب',
      options: [
        'کمتر از ۵ ساعت',
        '۵ تا ۶ ساعت',
        '۶ تا ۷ ساعت',
        '۷ تا ۸ ساعت',
        'بیشتر از ۸ ساعت',
      ],
    },
    {
      id: 2,
      title: 'وقتی از خواب بیدار می‌شوید، معمولاً چه احساسی دارید؟',
      prompt: 'SL2 – کیفیت خواب',
      options: [
        'سرحال و آماده برای شروع روز',
        'بعد از چند دقیقه خوب می‌شوم',
        'احساس سنگینی می‌کنم، انگار اصلاً نخوابیده‌ام',
        'از همان اول به چرت زدن فکر می‌کنم',
      ],
    },
    {
      id: 3,
      title: 'آیا در طول شب از خواب بیدار می‌شوید؟',
      prompt: 'SL3 – بیدار شدن در طول شب',
      options: [
        'نه، خوابم پیوسته است',
        'بله، یک بار (و راحت دوباره می‌خوابم)',
        'بله، چندین بار',
        'بله، و دوباره خوابیدن برایم سخت است',
      ],
    },
    {
      id: 4,
      title: 'آیا قبل از خواب روتین آرامش‌بخش مشخصی دارید؟',
      prompt: 'SL4 – روتین قبل از خواب',
      options: [
        'بله، هر شب',
        'بعضی وقت‌ها',
        'به ندرت',
        'نه، فقط خسته می‌شوم و می‌خوابم',
      ],
    },
    {
      id: 5,
      title: 'چند وقت یک‌بار غذاهای سرشار از پروتئین مصرف می‌کنید؟',
      prompt: 'N1 – مصرف پروتئین',
      options: [
        'در هر وعده غذایی',
        'روزی دو بار',
        'روزی یک بار',
        'چند بار در هفته',
        'به ندرت',
      ],
    },
    {
      id: 6,
      title: 'چند وقت یک‌بار چربی‌های سالم مصرف می‌کنید؟',
      prompt: 'N2 – چربی‌های سالم',
      options: ['روزانه', 'چند بار در هفته', 'هفته‌ای یک بار', 'به ندرت'],
    },
    {
      id: 7,
      title: 'روزانه چند وعده میوه و سبزیجات مصرف می‌کنید؟',
      prompt: 'N3 – مصرف میوه و سبزیجات',
      options: ['۵ وعده یا بیشتر', '۳ تا ۴ وعده', '۱ تا ۲ وعده', 'به ندرت'],
    },
    {
      id: 8,
      title: 'روزانه چند لیوان آب می‌نوشید؟',
      prompt: 'N4 – میزان آب مصرفی',
      options: [
        '۸ لیوان یا بیشتر',
        '۶ تا ۷ لیوان',
        '۴ تا ۵ لیوان',
        'کمتر از ۴ لیوان',
      ],
    },
    {
      id: 9,
      title: 'وضعیت گوارش خود را چگونه توصیف می‌کنید؟',
      prompt: 'N5 – وضعیت گوارش',
      options: [
        'بسیار راحت و منظم',
        'گاهی نفخ یا گاز معده دارم',
        'ناراحتی یا بی‌نظمی مکرر',
        'مشکلات مزمن (IBS، یبوست یا اسهال)',
      ],
    },
    {
      id: 10,
      title: 'چند وقت یک‌بار غذاهای فوق‌فرآوری‌شده مصرف می‌کنید؟',
      prompt: 'N6 – الگوی غذایی',
      options: [
        'به ندرت',
        '۱ تا ۲ بار در هفته',
        '۳ تا ۵ بار در هفته',
        'روزانه',
      ],
    },
    {
      id: 11,
      title: 'چند روز در هفته حداقل ۲۰ دقیقه ورزش می‌کنید؟',
      prompt: 'P1 – تعداد دفعات ورزش',
      options: [
        '۵ روز یا بیشتر',
        '۳ تا ۴ روز',
        '۱ تا ۲ روز',
        'به ندرت یا هرگز',
      ],
    },
    {
      id: 12,
      title: 'چه نوع فعالیت ورزشی را به‌صورت منظم انجام می‌دهید؟',
      prompt: 'P2 – نوع ورزش',
      options: [
        'پیاده‌روی',
        'ورزش هوازی (دویدن، دوچرخه‌سواری، شنا)',
        'تمرینات قدرتی',
        'یوگا / حرکات کششی',
        'هیچ‌کدام به‌صورت منظم',
      ],
    },
    {
      id: 13,
      title: 'خارج از ورزش، سبک زندگی روزانه شما چقدر فعال است؟',
      prompt: 'P3 – میزان تحرک روزانه',
      options: [
        'بسیار فعال (کار فیزیکی یا پیاده‌روی زیاد)',
        'نسبتاً فعال',
        'کم‌تحرک (کار پشت‌میزی و بیشتر نشسته)',
      ],
    },
    {
      id: 14,
      title: 'بعد از فعالیت بدنی معمولاً چه احساسی دارید؟',
      prompt: 'P4 – احساس بعد از ورزش',
      options: [
        'پرانرژی',
        'معمولی / بدون تغییر',
        'خسته اما حس خوبی دارم',
        'کاملاً خسته و بی‌حال',
      ],
    },
    {
      id: 15,
      title: 'چند وقت یک‌بار احساس استرس یا فشار روانی می‌کنید؟',
      prompt: 'M1 – میزان استرس',
      options: ['به ندرت', 'گاهی', 'اغلب', 'تقریباً هر روز'],
    },
    {
      id: 16,
      title: 'وقتی استرس دارید، آن را در کدام بخش بدن احساس می‌کنید؟',
      prompt: 'M2 – علائم فیزیکی استرس',
      options: [
        'سردرد یا فشار فک',
        'دل‌درد یا حالت تهوع',
        'تپش قلب یا تنفس سطحی',
        'هیچ علامت فیزیکی ندارم',
      ],
    },
    {
      id: 17,
      title: 'در یک ماه گذشته، حال روحی خود را چگونه توصیف می‌کنید؟',
      prompt: 'M3 – وضعیت روحیه',
      options: [
        'معمولاً مثبت و پایدار',
        'گاهی بی‌حوصلگی یا تحریک‌پذیری',
        'نوسانات روحی زیاد',
        'بیشتر اوقات بی‌انگیزه یا ناراحت',
      ],
    },
    {
      id: 18,
      title: 'آیا تمرین منظم برای آرامش ذهن دارید؟',
      prompt: 'M4 – تمرین آرام‌سازی',
      options: ['بله، روزانه', 'بعضی وقت‌ها', 'به ندرت', 'نه'],
    },
    {
      id: 19,
      title:
        'چند وقت یک‌بار با افرادی که از شما حمایت می‌کنند در ارتباط هستید؟',
      prompt: 'M5 – ارتباط اجتماعی',
      options: ['روزانه', 'چند بار در هفته', 'هفتگی', 'به ندرت'],
    },
    {
      id: 20,
      title: 'پوست خود را چگونه توصیف می‌کنید؟',
      prompt: 'B1 – وضعیت پوست',
      options: [
        'شفاف و آرام',
        'جوش‌های گاه‌به‌گاه',
        'آکنه یا جوش‌های مکرر',
        'خشک، پوسته‌پوسته یا دارای علائم پیری زودرس',
        'قرمزی یا روزاسه',
      ],
    },
    {
      id: 21,
      title: 'وقتی استرس دارید، پوست شما چه واکنشی نشان می‌دهد؟',
      prompt: 'B2 – واکنش پوست به استرس',
      options: [
        'هیچ تغییری نمی‌کند',
        'جوش‌ها بیشتر می‌شوند',
        'قرمزی یا التهاب',
        'خشکی یا تشدید اگزما',
      ],
    },
    {
      id: 22,
      title: 'آیا مشکلی در مو یا ناخن خود مشاهده می‌کنید؟',
      prompt: 'B3 – وضعیت مو و ناخن',
      options: [
        'هیچ مشکلی ندارم',
        'نازک شدن یا ریزش مو',
        'شکنندگی ناخن',
        'رشد کند مو',
        'موهای خشک یا آسیب‌دیده',
      ],
    },
    {
      id: 23,
      title: 'روتین مراقبت پوستی شما چقدر منظم است؟',
      prompt: 'B4 – روتین مراقبت پوستی',
      options: [
        'هر روز، چند مرحله‌ای',
        'هر روز، ساده (شستشو + مرطوب‌کننده)',
        'بعضی وقت‌ها',
        'هیچ روتینی ندارم',
      ],
    },
    {
      id: 24,
      title: 'آیا بیماری یا مشکل سلامت بلندمدت دارید؟',
      prompt: 'C1 – بیماری‌های مزمن',
      options: [
        'فشار خون بالا',
        'کلسترول بالا',
        'دیابت / پیش‌دیابت',
        'اختلال تیروئید',
        'کم‌خونی یا فقر آهن',
        'بیماری خودایمنی',
        'افسردگی / اضطراب',
        'هیچ‌کدام',
      ],
    },
    {
      id: 25,
      title:
        'آیا در خانواده نزدیک شما سابقه بیماری قلبی، دیابت یا فشار خون بالا وجود دارد؟',
      prompt: 'C2 – سابقه خانوادگی',
      options: ['بله، یک یا چند مورد', 'خیر', 'مطمئن نیستم'],
    },
    {
      id: 26,
      title: 'آیا به‌صورت منظم داروی تجویزی مصرف می‌کنید؟',
      prompt: 'C3 – مصرف دارو',
      options: ['بله، یک دارو', 'بله، دو دارو یا بیشتر', 'خیر'],
    },
    {
      id: 27,
      title: 'آیا به چیزی آلرژی یا حساسیت دارید؟',
      prompt: 'C4 – آلرژی یا حساسیت',
      options: [
        'گلوتن',
        'لبنیات',
        'صدف دریایی',
        'سویا',
        'مغزها / آجیل',
        'هیچ‌کدام',
      ],
    },
    {
      id: 28,
      title: 'آخرین چکاپ کامل پزشکی شما چه زمانی بوده است؟',
      prompt: 'C5 – چکاپ پزشکی',
      options: [
        'در یک سال گذشته',
        '۱ تا ۲ سال پیش',
        'بیشتر از ۲ سال پیش',
        'یادم نیست / هرگز',
      ],
    },
  ]

  const [currentQuestion, setCurrentQuestion] = useState<number>(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [direction, setDirection] = useState<Direction>(1)
  const [error, setError] = useState<boolean>(false)
  const router = useRouter()
  const { submit, loading, error: submitError } = useHealthAssessment()

  const handleNext = async (): Promise<void> => {
    const current = questions[currentQuestion]
    const questionId = current.id

    // Validation
    if (current.options && !answers[questionId]) {
      setError(true)
      return
    }

    setError(false)

    // Next Question
    if (currentQuestion < questions.length - 1) {
      setDirection(1)
      setCurrentQuestion((prev) => prev + 1)
      return
    }

    // Final Submit
    try {
      const result = await submit(answers)

      console.log(result)

      alert('تست شما با موفقیت ثبت شد!')

      router.push(`/aiForm/result/${result.assessment.id}`)
    } catch (error) {
      console.error(error)
    }
  }

  const handlePrevious = (): void => {
    setError(false)
    if (currentQuestion > 0) {
      setDirection(-1)
      setCurrentQuestion((prev: number) => prev - 1)
    }
  }

  const handleOptionSelect = (option: string): void => {
    setError(false)

    const questionId = questions[currentQuestion].id

    setAnswers((prev: Answers) => ({
      ...prev,
      [questionId]: option,
    }))
  }

  const progress = (currentQuestion / (questions.length - 1)) * 100

  return (
    <div className="flex min-h-screen flex-col justify-center">
      {/* Progress Bar - Fixed Top */}
      <div className="fixed top-0 right-0 left-0 z-50 bg-white/80 backdrop-blur-sm">
        <div className="h-1.25 bg-gray-200">
          <motion.div
            className="h-full bg-[#087112]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {/* Main Content - Centered */}
      <div className="flex items-center justify-center">
        {submitError && (
          <p className="mt-4 text-sm font-medium text-red-500">{submitError}</p>
        )}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            custom={direction}
            initial={{
              x: direction > 0 ? 200 : -200,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x: direction < 0 ? 200 : -200,
              opacity: 0,
            }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="w-full px-6"
          >
            <div className="mx-auto flex w-full max-w-5xl gap-6">
              {/* Question ID and Arrow */}
              <div className="flex gap-1 self-start pt-2">
                <h2 className="font-aria text-lg text-black">
                  {questions[currentQuestion].id.toLocaleString('fa-IR')}
                </h2>
                <Image
                  src="/images/left-arrow.svg"
                  width={24}
                  height={24}
                  alt="left arrow"
                />
              </div>

              {/* Question Content */}
              <div className="flex-1">
                <div className="text-black">
                  <h1 className="font-aria text-6xl font-extrabold">
                    {questions[currentQuestion].title}
                  </h1>
                  <p className="font-ray mt-6 text-lg font-medium text-[#555555]">
                    {questions[currentQuestion].prompt}
                  </p>
                </div>

                {/* Options */}
                {questions[currentQuestion].options && (
                  <div className="mt-8 space-y-3">
                    {questions[currentQuestion].options.map(
                      (option: string, index: number) => {
                        const questionId = questions[currentQuestion].id
                        const isSelected = answers[questionId] === option

                        return (
                          <motion.button
                            key={`${questionId}-${index}`}
                            type="button"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            onClick={() => handleOptionSelect(option)}
                            className={`font-ray w-full cursor-pointer rounded-lg border-2 p-4 text-right transition-all duration-200 ${
                              isSelected
                                ? 'border-[#555555] bg-gray-50 text-[#555555]'
                                : error
                                  ? 'border-red-300 text-[#555555] hover:border-red-400'
                                  : 'border-gray-200 text-[#555555] hover:border-gray-300'
                            }`}
                          >
                            {option}
                          </motion.button>
                        )
                      },
                    )}
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="font-ray mt-4 text-sm font-medium text-red-500"
                  >
                    لطفاً یک گزینه را انتخاب کنید
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-5 bg-white/80 p-6 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center gap-12">
          {/* Previous Button */}
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`font-aria mr-15 flex items-center gap-2 text-lg font-extrabold transition-all duration-200 ${
              currentQuestion === 0
                ? 'cursor-not-allowed text-gray-300'
                : 'cursor-pointer text-black hover:text-gray-600'
            }`}
          >
            <Image
              src="/images/left-arrow.svg"
              width={24}
              height={24}
              alt="back"
              className={`rotate-180 transform ${currentQuestion === 0 ? 'opacity-30' : ''}`}
            />
            قبلی
          </button>

          {/* Next Button */}
          <button
            disabled={loading}
            onClick={handleNext}
            className="to-accent-blue from-accent-purple font-aria flex h-13.5 w-52.5 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-linear-to-br text-lg font-extrabold text-black transition-opacity hover:opacity-90"
          >
            {loading
              ? 'در حال تحلیل...'
              : currentQuestion === questions.length - 1
                ? 'پایان'
                : 'ادامه'}
            <Image
              src="/images/left-arrow.svg"
              width={24}
              height={24}
              alt="left arrow"
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Page
