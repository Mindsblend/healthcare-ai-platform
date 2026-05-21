'use client'

import Image from 'next/image'
import { useState } from 'react'
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
        'این تست نتیجه‌ی ترکیب دو دنیا است: از یک طرف، دانش ارزشمند و هزارساله‌ی طب سنتی ایرانی که ریشه در شناخت عمیق بدن و تعادل مزاج‌ها دارد، و از طرف دیگر، قدرت بی‌نظیر تحلیل داده‌ها توسط هوش مصنوعی. با پاسخ دادن دقیق به پرسش‌ها، الگوریتم هوشمند ما می‌تواند تصویر روشنی از وضعیت بدنی شما ترسیم کند و گزارشی شخصی‌سازی‌شده به شما ارائه دهد. این گزارش شامل تیپ بدنی شما، توصیه‌های غذایی متناسب، پیشنهادهایی برای سبک زندگی و حتی نکاتی درباره پیشگیری از مشکلات احتمالی در آینده خواهد بود. هرچه پاسخ‌های شما جزئی‌تر و دقیق‌تر باشد، نتیجه نهایی واقعی‌تر و کاربردی‌تر خواهد شد. این تست فقط یک پرسشنامه ساده نیست؛ بلکه یک راهنماست که می‌تواند در عرض چند دقیقه به شما بینشی بدهد که بسیاری افراد برای به‌دست آوردنش ماه‌ها وقت و هزینه صرف می‌کنند. به یاد داشت  باشید: تکمیل این تست کمتر از ۳ دقیقه طول می‌کشد، اما بینشی که دریافت می‌کنید می‌تواند مسیر جدیدی برای سلامتی، انرژی و آرامش شما در سال‌های آینده بسازد.',
      options: ['شروع تست', 'بیشتر بدانم'],
    },
    {
      id: 2,
      title: 'سن شما چقدر است؟',
      prompt: 'لطفاً بازه سنی خود را انتخاب کنید.',
      options: [
        'زیر ۲۰ سال',
        '۲۰ تا ۳۰ سال',
        '۳۰ تا ۴۰ سال',
        '۴۰ تا ۵۰ سال',
        'بالای ۵۰ سال',
      ],
    },
    {
      id: 3,
      title: 'معمولاً چه میزان آب در روز می‌نوشید؟',
      prompt: 'این سوال به ما در تشخیص مزاج شما کمک می‌کند.',
      options: [
        'کمتر از ۴ لیوان',
        '۴ تا ۸ لیوان',
        '۸ تا ۱۲ لیوان',
        'بیشتر از ۱۲ لیوان',
      ],
    },
    {
      id: 4,
      title: 'آب و هوای مورد علاقه شما کدام است؟',
      prompt: 'این سوال به ما در تشخیص مزاج شما کمک می‌کند.',
      options: [
        'گرم و خشک',
        'گرم و مرطوب',
        'سرد و خشک',
        'سرد و مرطوب',
        'معتدل',
      ],
    },
  ]

  const [currentQuestion, setCurrentQuestion] = useState<number>(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [direction, setDirection] = useState<Direction>(1)
  const [error, setError] = useState<boolean>(false)

  const handleNext = (): void => {
    if (questions[currentQuestion].options && !answers[currentQuestion]) {
      setError(true)

      setTimeout(() => {
        setError(false)
      }, 2000)

      return
    }

    setError(false)

    if (currentQuestion < questions.length - 1) {
      setDirection(1)
      setCurrentQuestion((prev: number) => prev + 1)
    } else {
      console.log('Form submitted:', answers)
      alert('تست شما با موفقیت ثبت شد!')
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
    setAnswers((prev: Answers) => ({
      ...prev,
      [currentQuestion]: option,
    }))
  }
  const progress: number = ((currentQuestion + 1) / questions.length) * 100

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
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQuestion}
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
                      (option: string, index: number) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          onClick={() => handleOptionSelect(option)}
                          className={`font-ray w-full cursor-pointer rounded-lg border-2 p-4 text-right transition-all duration-200 ${
                            answers[currentQuestion] === option
                              ? 'border-[#555555] bg-gray-50 text-[#555555]'
                              : error
                                ? 'border-red-300 text-[#555555] hover:border-red-400'
                                : 'border-gray-200 text-[#555555] hover:border-gray-300'
                          }`}
                        >
                          {option}
                        </motion.button>
                      ),
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
            onClick={handleNext}
            className="to-accent-blue from-accent-purple font-aria flex h-13.5 w-52.5 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-linear-to-br text-lg font-extrabold text-black transition-opacity hover:opacity-90"
          >
            {currentQuestion === questions.length - 1 ? 'پایان' : 'ادامه'}
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
