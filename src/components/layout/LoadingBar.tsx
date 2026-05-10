// components/LoadingBar.tsx
import React from 'react'

interface LoadingBarProps {
  loading: boolean
  error?: string | null
  children: React.ReactNode
  loadingText?: string
  errorTitle?: string
}

const LoadingBar: React.FC<LoadingBarProps> = ({
  loading,
  error,
  children,
  loadingText = 'در حال بارگذاری محصولات...',
  errorTitle = 'خطا در بارگذاری',
}) => {
  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
          <p className="text-gray-600">{loadingText}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 w-fit rounded-full bg-red-100 p-4">
            <svg
              className="h-12 w-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-red-600">
            {errorTitle}: {error}
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default LoadingBar
