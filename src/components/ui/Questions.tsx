'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FaqType } from '@/features/shop/shop.types'

interface FaqItemProps {
  item: FaqType
  isOpen: boolean
  onToggle: () => void
}

const FaqItem = ({ item, isOpen, onToggle }: FaqItemProps) => {
  return (
    <div>
      {/* Question */}
      <div
        className="flex cursor-pointer items-start justify-between gap-4 pt-3"
        onClick={onToggle}
      >
        <h2 className="font-aria text-color-title-on-light text-xl font-extrabold sm:text-2xl">
          {item.question}
        </h2>

        <motion.span
          animate={{ rotate: isOpen ? -90 : 0 }}
          transition={{ duration: 0.3 }}
          aria-label={isOpen ? 'Collapse answer' : 'Expand answer'}
          className="shrink-0"
        >
          <Image
            src="/images/arrow.svg"
            alt="arrow icon"
            width={20}
            height={20}
            className="h-5 w-5"
          />
        </motion.span>
      </div>

      {/* Answer */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="font-ray text-color-body-on-light max-w-full pt-2 pb-4 text-base font-medium sm:max-w-[596px] sm:text-lg">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface QuestionsProps {
  faqs: FaqType[]
}

const Questions = ({ faqs }: QuestionsProps) => {
  const [activeId, setActiveId] = useState<number | null>(null)

  const leftFaqs = faqs ? faqs.slice(0, 3) : []
  const rightFaqs = faqs ? faqs.slice(3, 6) : []

  return (
    <div className="sm:mt-11 flex w-full flex-col justify-between gap-6 md:gap-10 lg:flex-row">
      {/* left side */}
      <div className="w-full lg:w-1/2">
        {leftFaqs.map((item, index) => {
          const isOpen = activeId === item.id

          return (
            <div key={item.id}>
              <FaqItem
                item={item}
                isOpen={isOpen}
                onToggle={() => setActiveId(isOpen ? null : item.id)}
              />
              {index !== leftFaqs.length - 1 && (
                <hr className="border-color-title-on-light mt-1 border" />
              )}
            </div>
          )
        })}
      </div>

      {/* right side */}
      <div className="w-full lg:w-1/2">
        {rightFaqs.map((item, index) => {
          const isOpen = activeId === item.id

          return (
            <div key={item.id}>
              <FaqItem
                item={item}
                isOpen={isOpen}
                onToggle={() => setActiveId(isOpen ? null : item.id)}
              />
              {index !== rightFaqs.length - 1 && (
                <hr className="border-color-title-on-light mt-1 border" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Questions
