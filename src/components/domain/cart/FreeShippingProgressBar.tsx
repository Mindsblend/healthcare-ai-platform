'use client'

import { motion } from 'framer-motion'

type FreeShippingProgressProps = {
  subtotal: number
  threshold?: number
}

const FreeShippingProgressBar = ({
  subtotal,
  threshold = 2_000_000,
}: FreeShippingProgressProps) => {
  const progress = Math.min(subtotal / threshold, 1)
  const remaining = Math.max(threshold - subtotal, 0)

  return (
    <div className="mt-2 mb-2 w-full">
      {/* Progress Bar Background */}
      <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
        <motion.div
          className="bg-section-deep h-4 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>

      {/* Text */}
      <p className="mt-2 text-center text-sm font-medium text-gray-700">
        {progress >= 1
          ? 'ارسال رایگان 🎉'
          : `${remaining.toLocaleString('fa-IR')} تومان تا ارسال رایگان`}
      </p>
    </div>
  )
}

export default FreeShippingProgressBar
