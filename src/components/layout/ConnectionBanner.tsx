'use client'

import { useEffect, useRef, useState } from 'react'
import { useConnectionStatus } from '@/hooks/Useconnectionstatus '

type Phase = 'hidden' | 'offline' | 'restored'

function WifiOffIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2 8.82a15 15 0 0 1 4.17-2.65" />
      <path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76" />
      <path d="M16.85 11.25a10 10 0 0 1 2.22 1.68" />
      <path d="M5 13a10 10 0 0 1 5.24-2.76" />
      <path d="M12 20h.01" />
      <path d="m2 2 20 20" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth={3}
        className="opacity-25"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function ConnectionBanner() {
  const { isOnline, isChecking, retry } = useConnectionStatus()
  const [phase, setPhase] = useState<Phase>('hidden')
  const wasOffline = useRef(false)

  useEffect(() => {
    if (!isOnline) {
      wasOffline.current = true
      setPhase('offline')
      return
    }

    if (wasOffline.current) {
      wasOffline.current = false
      setPhase('restored')
      const t = setTimeout(() => setPhase('hidden'), 3500)
      return () => clearTimeout(t)
    }
  }, [isOnline])

  const visible = phase !== 'hidden'
  const offline = phase === 'offline'

  return (
    <div
      role={offline ? 'alert' : 'status'}
      aria-live={offline ? 'assertive' : 'polite'}
      className={[
        'pointer-events-none fixed inset-x-0 top-0 z-[100] flex justify-center px-4 pt-3',
        'transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
        visible ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0',
      ].join(' ')}
    >
      <div
        className={[
          'pointer-events-auto relative flex w-full max-w-md items-center gap-3 overflow-hidden',
          'rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-xl',
          'transition-colors duration-500',
          offline
            ? 'border-red-400/30 bg-red-950/80 text-red-50 shadow-red-900/30'
            : 'border-emerald-400/30 bg-emerald-950/80 text-emerald-50 shadow-emerald-900/30',
        ].join(' ')}
      >
        {/* آیکون */}
        <div
          className={[
            'relative flex size-10 shrink-0 items-center justify-center rounded-xl',
            offline
              ? 'bg-red-500/20 text-red-300'
              : 'bg-emerald-500/20 text-emerald-300',
          ].join(' ')}
        >
          {offline && (
            <span className="absolute inset-0 animate-ping rounded-xl bg-red-500/20 motion-reduce:hidden" />
          )}
          {offline ? (
            <WifiOffIcon className="relative size-5" />
          ) : (
            <CheckIcon className="relative size-5" />
          )}
        </div>

        {/* متن */}
        <div className="min-w-0 flex-1">
          <p className="text-sm leading-6 font-semibold">
            {offline ? 'اتصال اینترنت قطع شد' : 'دوباره آنلاین شدید'}
          </p>
          <p className="text-xs leading-5 opacity-70">
            {offline
              ? isChecking
                ? 'در حال بررسی اتصال...'
                : 'اتصال شما برقرار نیست؛ خودکار دوباره تلاش می‌کنیم.'
              : 'اتصال شما با موفقیت برقرار شد.'}
          </p>
        </div>

        {/* دکمه تلاش مجدد */}
        {offline && (
          <button
            type="button"
            onClick={retry}
            disabled={isChecking}
            className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium transition hover:bg-white/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isChecking && <SpinnerIcon className="size-3.5 animate-spin" />}
            تلاش مجدد
          </button>
        )}

        {/* نوار پیشرفت برای حالت «برقرار شد» */}
        {!offline && visible && (
          <span className="absolute inset-x-0 bottom-0 h-0.5 origin-right animate-[shrink_3.5s_linear_forwards] bg-emerald-400/70 motion-reduce:hidden" />
        )}
      </div>
    </div>
  )
}
