'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// نسخه‌ی موبایل: بدون قفل شدن اسکرول و بدون h-[400vh].
// ارتفاع کانتینر برابر محتوای واقعی است، هر step با whileInView
// در لحظه‌ی ورود به دید انیمیشن می‌گیرد و یک خط عمودی پیشرفت
// هم‌زمان با اسکرول عادی پر می‌شود.
export default function MobileStepsTimeline() {
  const containerRef = useRef<HTMLDivElement>(null)

  const steps = [
    {
      title: 'وضعیت فعلی بدن خود را بشناسید',
      description:
        'با یک تست هوشمند، وضعیت سلامتی و عادات بدن خود را کشف کنید. شناخت دقیق، اولین قدم برای گرفتن تصمیمات درست و هدفمند است.',
    },
    {
      title: 'اهداف شخصی خود را تعیین کنید',
      description:
        'برای رسیدن به بهترین نسخه خود، اهداف دقیق و واقع‌بینانه تعریف کنید. کاهش وزن، افزایش انرژی، یا بهبود تناسب اندام — مسیر شما از همین جا آغاز می‌شود.',
    },
    {
      title: 'برنامه غذایی و ورزشی اختصاصی خود را دریافت کنید',
      description:
        'با استفاده از داده‌های شما، برنامه‌ای سفارشی و هوشمند برای تغذیه و تمرین ارائه می‌کنیم که با سبک زندگی شما هماهنگ باشد.',
    },
    {
      title: 'پیشرفت خود را دنبال کنید و بهینه‌سازی کنید',
      description:
        'با گزارش‌های تحلیلی و بازخوردهای مستمر، روند پیشرفت خود را مشاهده کرده و تغییرات لازم را اعمال کنید تا همیشه در مسیر درست باقی بمانید.',
    },
  ]

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.75', 'end 0.4'],
  })
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '99%'])

  return (
    <div ref={containerRef} className="relative mx-auto max-w-md py-10 mt-15">
      {/* خط پس‌زمینه */}
      <div className="absolute top-2 right-5 bottom-0 w-0.5 bg-white/15" />
      {/* خط پیشرفت، هماهنگ با اسکرول */}
      <motion.div
        style={{ height: lineHeight }}
        className="bg-accent-purple absolute top-2 right-5 w-0.5 origin-top"
      />

      <div className="flex flex-col gap-14">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="relative pr-12 text-right"
          >
            <div className="border-accent-purple bg-section absolute top-0 right-1.5 flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold text-white">
              {i + 1}
            </div>
            <h3 className="font-aria text-lg font-bold mt-1 text-white">
              {step.title}
            </h3>
            <p className="font-ray text-color-body-on-dark mt-2 text-sm">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
