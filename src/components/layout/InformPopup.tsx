'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Define the props interface for the Inform
interface InformPopupProps {
  message: string | null | undefined // The message to display
  duration?: number // How long the popup should be visible (in milliseconds)
  closeOnEscape?: boolean // Whether to close the popup when Escape key is pressed
  maxWidth?: string // Max-width of the popup (e.g., 'sm', 'md', 'lg')
  backgroundColor?: string // Background color of the popup
  textColor?: string // Text color of the error message
  progressBarColor?: string // Color of the progress bar
  initialYOffset?: number // Initial Y offset for animation (e.g., -20)
  transitionDuration?: number // Duration of the fade/slide animation
}

export default function InformPopup({
  message,
  duration = 3500, // Default duration
  closeOnEscape = true, // Default to closing on Escape
  maxWidth = 'max-w-sm', // Default max-width
  backgroundColor = 'bg-section', // Default background
  textColor = 'text-white', // Default text color
  progressBarColor = 'bg-gray-400', // Default progress bar color
  initialYOffset = -20, // Default initial Y offset
  transitionDuration = 0.3, // Default animation transition duration
}: InformPopupProps) {
  const [visibleMessage, setVisibleMessage] = useState<
    string | null | undefined
  >(message)

  useEffect(() => {
    setVisibleMessage(message)

    if (message) {
      const timer = setTimeout(() => {
        setVisibleMessage(null)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [message, duration]) // Added duration to dependency array

  // Handle Escape key press if enabled
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setVisibleMessage(null)
      }
    }

    if (message && closeOnEscape) {
      document.addEventListener('keydown', handleEsc)
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
    }
  }, [message, closeOnEscape]) // Added closeOnEscape to dependency array

  return (
    <AnimatePresence>
      {visibleMessage && (
        <motion.div
          initial={{ opacity: 0, y: initialYOffset }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: initialYOffset }}
          transition={{ duration: transitionDuration }}
          className={`fixed top-8 left-1/2 z-100000 w-[90%] ${maxWidth} -translate-x-1/2 rounded-md shadow-lg ${backgroundColor}`}
        >
          <div className={`px-6 py-4.5 ${textColor}`}>{visibleMessage}</div>

          {/* Progress bar: shrinks right-to-left */}
          <motion.div
            className={`h-1 w-full rounded-b-md ${progressBarColor}`}
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
