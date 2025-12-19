'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { faqType } from '../types/types'

interface FaqItemProps {
  item: faqType
  isOpen: boolean
  onToggle: () => void
}

const FaqItem = ({ item, isOpen, onToggle }: FaqItemProps) => {
  return (
    <div>
      {/* Question */}
      <div
        className="flex cursor-pointer items-start justify-between pt-3"
        onClick={onToggle}
      >
        <h2 className="font-aria text-color-title-on-light text-2xl font-extrabold">
          {item.question}
        </h2>

        <motion.span
          animate={{ rotate: isOpen ? -90 : 0 }}
          transition={{ duration: 0.3 }}
          aria-label={isOpen ? 'Collapse answer' : 'Expand answer'}
        >
          <Image
            src="/images/arrow.svg"
            alt="arrow icon"
            width={20}
            height={20}
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
            <p className="font-ray text-color-body-on-light max-w-[596px] pt-2 pb-4 text-lg font-medium">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface QuestionsProps {
  faqs: faqType[]
}

const Questions = ({ faqs }: QuestionsProps) => {
  const [activeId, setActiveId] = useState<number | null>(null)

  const leftFaqs = faqs ? faqs.slice(0, 3) : []
  const rightFaqs = faqs ? faqs.slice(3, 6) : []

  return (
    <div className="mt-11 flex w-full flex-col justify-between gap-10 px-18 lg:flex-row 2xl:px-56">
      {/* left side */}
      <div className="w-[607px]">
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
      <div className="w-[607px]">
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
