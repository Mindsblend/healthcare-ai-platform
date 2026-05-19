'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useCreateSubscription } from '@/features/dashboard/hooks/createSubscription'
import InformPopup from '@/components/layout/InformPopup'

const NewsletterSection = () => {
  const { createSubscription, loading } = useCreateSubscription()
  const [email, setEmail] = useState('')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    try {
      await createSubscription({ email })
      setSuccessMessage('ایمیل شما با موفقیت ثبت شد')
      setEmail('')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err: any) {
      setErrorMessage(err?.message || '❌ خطا در ثبت ایمیل')
      setTimeout(() => setErrorMessage(null), 3000)
    }
  }

  return (
    <div className="container px-4 py-12 md:px-6 lg:px-0">
      <div className="bg-section text-color-title-on-dark flex w-full flex-col items-center justify-center rounded-2xl px-6 py-10 text-center md:px-10 lg:px-14 lg:py-14">
        <h1 className="font-aria mb-2 text-2xl font-bold sm:text-3xl md:text-4xl xl:text-5xl">
          دانشی که سلامتی فردای تو را می‌سازد
        </h1>

        <p className="font-ray text-color-body-on-dark mt-5 max-w-2xl text-xs sm:text-sm md:text-base xl:text-lg">
          با عضویت در خبرنامه ما، به محتوای اختصاصی، راهنمایی‌های علمی و قدم‌های
          ساده‌ای دسترسی پیدا می‌کنید که می‌تواند کیفیت زندگی و انرژی روزانه شما
          را متحول کند. از آخرین تحقیقات پزشکی تا توصیه‌های عملی برای تغذیه و
          سبک زندگی سالم—همه در یک ایمیل کوتاه و کاربردی، مخصوص شما.
        </p>

        {/* Newsletter Input Box */}
        <form
          onSubmit={handleSubscribe}
          className="mt-9 flex w-full max-w-3xl items-center rounded-2xl text-black"
        >
          <div className="bg-section-deep flex w-full flex-col items-center gap-3 rounded-2xl px-4 py-3 md:flex-row md:gap-0 xl:py-4">
            {/* Input */}
            <input
              type="email"
              placeholder="ایمیل"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dir="rtl"
              className="font-ray placeholder-color-body-on-dark text-color-body-on-dark w-full bg-transparent px-3 text-center text-xl outline-none md:text-right md:text-2xl"
            />

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-accent-purple flex h-[54px] w-full items-center justify-between rounded-full px-4 text-white disabled:opacity-50 md:w-[170px] xl:h-[58px] xl:w-[210px]"
            >
              {/* Button text */}
              <span className="font-aria pr-3 text-base font-semibold text-black xl:pr-8">
                {loading ? 'در حال ثبت...' : 'عضویت'}
              </span>

              {/* Circle with icon */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
                <Image
                  src="/images/arrow-white.svg"
                  alt="Top Right Image"
                  width={20}
                  height={20}
                />
              </div>
            </button>
          </div>
        </form>
      </div>

      <InformPopup message={successMessage} />
      <InformPopup message={errorMessage} />
    </div>
  )
}

export default NewsletterSection
