'use client'

import { forwardRef, type ChangeEvent } from 'react'

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  size?: 'sm' | 'md' | 'lg'
  label?: string
  onChange?: (checked: boolean) => void
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ checked, onChange, disabled, size = 'md', className, id, label, ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-5 w-9',
      md: 'h-6 w-11',
      lg: 'h-7 w-13',
    }

    const thumbSizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    }

    const thumbTranslateClasses = {
      sm: 'translate-x-5',
      md: 'translate-x-6',
      lg: 'translate-x-7',
    }

    const switchId = id || `switch-${Math.random().toString(36).slice(2, 9)}`

    return (
      <label className={`inline-flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className || ''}`}>
        <input
          ref={ref}
          type="checkbox"
          id={switchId}
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <div
          className={`
            relative inline-flex flex-shrink-0 rounded-full border-2 transition-colors duration-200 ease-in-out
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B2024] focus-visible:ring-offset-2
            ${sizeClasses[size]}
            ${checked ? 'bg-[#1B2024] border-[#1B2024]' : 'bg-[#D9D9D9] border-[#D9D9D9]'}
          `}
          aria-hidden="true"
        >
          <span
            className={`
              pointer-events-none inline-block rounded-full bg-white shadow-lg transform ring-0 transition-transform duration-200 ease-in-out
              ${thumbSizeClasses[size]}
              ${checked ? thumbTranslateClasses[size] : 'translate-x-0'}
            `}
          />
        </div>
        {label && (
          <span className="mr-3 font-ray text-sm font-medium text-[#1B2024]">{label}</span>
        )}
      </label>
    )
  }
)

Switch.displayName = 'Switch'