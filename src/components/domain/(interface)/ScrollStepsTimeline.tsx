'use client'

import { useRef, useState, useLayoutEffect } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion'

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

const ARC_RADIUS = 500
const CENTER_X = 500
const CENTER_Y = 600
const STEP_SPACING = Math.PI / 3

export default function ScrollStepsTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [currentStep, setCurrentStep] = useState(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const angles = useRef(
    steps.map((_, i) =>
      useSpring(useMotionValue(Math.PI / 2 + i * STEP_SPACING), {
        stiffness: 120,
        damping: 20,
      }),
    ),
  ).current

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const step = Math.min(steps.length - 1, Math.floor(v * steps.length))
    if (step !== currentStep) {
      setCurrentStep(step)
    }
  })

  useLayoutEffect(() => {
    angles.forEach((angle, i) => {
      angle.set(Math.PI / 2 + (i - currentStep) * STEP_SPACING)
    })
  }, [currentStep, angles])

  return (
    <section ref={sectionRef} className="bg-section relative h-[400vh] w-full">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-end overflow-hidden">
        <div className="relative w-full">
          <svg
            viewBox={`0 0 1000 530`}
            className="h-auto w-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              d={`M 0 ${CENTER_Y} A ${ARC_RADIUS} ${ARC_RADIUS} 0 0 1 1000 ${CENTER_Y}`}
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeOpacity={0.2}
            />

            {/* --- STATIC UI LINE --- */}
            <line
              x1={CENTER_X}
              y1={CENTER_Y - ARC_RADIUS + 50}
              x2={CENTER_X}
              y2={CENTER_Y - ARC_RADIUS / 2 - 40}
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeOpacity={0.2}
            />

            {/* CARS ON ROAD */}
            {angles.map((angle, i) => {
              const x = useTransform(
                angle,
                (a) => CENTER_X + ARC_RADIUS * Math.cos(a),
              )
              const y = useTransform(
                angle,
                (a) => CENTER_Y - ARC_RADIUS * Math.sin(a),
              )

              return (
                <motion.g key={i}>
                  <motion.circle cx={x} cy={y} r={14} fill={'#B1C8FF'} />

                  <motion.circle
                    cx={x}
                    cy={useTransform(y, (v) => v - 54)}
                    r={22}
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeOpacity={0.2}
                  />
                  {/* Number Text */}
                  <motion.text
                    x={x}
                    y={useTransform(y, (v) => v - 45)}
                    textAnchor="middle"
                    fontSize={24}
                    fontWeight="900"
                    fill="white"
                  >
                    {i + 1}
                  </motion.text>
                </motion.g>
              )
            })}

            {/* Title & description inside the half circle */}
            <foreignObject
              x={CENTER_X - 180}
              y={CENTER_Y - ARC_RADIUS / 2 - 40}
              width={360}
              height={250}
            >
              <div className="flex flex-col items-center justify-center px-4 text-center">
                <motion.h2
                  key={`title-${currentStep}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-aria text-base font-bold text-white sm:text-lg md:text-xl lg:text-2xl"
                >
                  {steps[currentStep].title}
                </motion.h2>
                <motion.p
                  key={`desc-${currentStep}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="font-ray text-color-body-on-dark mt-2 text-xs sm:text-sm md:text-base"
                >
                  {steps[currentStep].description}
                </motion.p>
              </div>
            </foreignObject>
          </svg>
        </div>
      </div>
    </section>
  )
}
