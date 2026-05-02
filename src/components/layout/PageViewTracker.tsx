// components/PageViewTracker.tsx
'use client'

import { useEffect } from 'react'
import { createTrackVisit } from '@/features/dashboard/hooks/trackVisit' // Import your custom hook

export default function PageViewTracker() {
  // Call the custom hook at the top level of the component.
  // This gives us access to the tracking function and its state.
  const { useTrackedVisit, loading, error, data } = createTrackVisit()

  // Now, use useEffect within *this component* to call the trackVisit function
  // provided by the hook. This is where the side effect is initiated.
  useEffect(() => {
    // Call the trackVisit function from the hook
    useTrackedVisit()
  }, []) // Dependency array includes trackVisit to ensure it's stable

  // This component renders nothing, but it orchestrates the tracking side effect.
  if (loading) {
    return null
  }

  if (error) {
    // Optional: log the error
    console.error('Failed to track page view:', error.message)
    return null // Render nothing if there's an error
  }

  return null
}
