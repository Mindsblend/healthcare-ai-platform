'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ErrorPopupProps {
  error: string | null
}

export default function ErrorPopup({ error }: ErrorPopupProps) {
  const [visibleError, setVisibleError] = useState<string | null>(error)
  const duration = 3500

  useEffect(() => {
    setVisibleError(error)

    if (error) {
      const timer = setTimeout(() => {
        setVisibleError(null)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [error])

  return (
    <AnimatePresence>
      {visibleError && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-section fixed top-8 left-1/2 z-50 w-[90%] max-w-sm -translate-x-1/2 rounded-md shadow-lg"
        >
          <div className="px-6 py-4.5 text-white">{visibleError}</div>

          {/* Progress bar: shrinks right-to-left */}
          <motion.div
            className="bg-gray-400 h-1 w-full rounded-b-md"
            style={{ originX: 1 }} // shrink from right
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: duration / 1000, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
