'use client'
import { useRef, useState, useEffect } from 'react'

interface PriceRangeSliderProps {
  min?: number
  max?: number
  minPrice: number
  maxPrice: number
  step?: number
  onChange: (min: number, max: number) => void
}

const PriceRangeSlider = ({
  min = 0,
  max = 1_000_000,
  minPrice,
  maxPrice,
  step = 10_000,
  onChange,
}: PriceRangeSliderProps) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const minValue = minPrice
  const maxValue = maxPrice
  const [dragging, setDragging] = useState<'max' | 'min' | null>(null)

  const valueToPercent = (value: number) => ((value - min) / (max - min)) * 100

  const percentToValue = (percent: number) => {
    const raw = min + ((max - min) * percent) / 100
    return Math.round(raw / step) * step
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!trackRef.current || !dragging) return
    const rect = trackRef.current.getBoundingClientRect()
    let percent = ((e.clientX - rect.left) / rect.width) * 100
    percent = Math.max(0, Math.min(100, percent))
    const newValue = percentToValue(percent)

    if (dragging === 'min') {
      onChange(Math.min(newValue, maxValue), maxValue)
    }

    if (dragging === 'max') {
      onChange(minValue, Math.max(newValue, minValue))
    }
  }

  const handleMouseUp = () => setDragging(null)

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  })

  const leftPercent = Math.min(
    valueToPercent(minValue),
    valueToPercent(maxValue),
  )
  const widthPercent = Math.abs(
    valueToPercent(maxValue) - valueToPercent(minValue),
  )

  return (
    <div className="w-full px-2">
      {/* Track */}
      <div
        ref={trackRef}
        className="relative h-1 w-full rounded-full bg-gray-300"
      >
        {/* Highlighted range */}
        <div
          className="absolute h-1 rounded-full bg-black"
          style={{
            left: `${leftPercent}%`,
            width: `${widthPercent}%`,
          }}
        />

        {/* Right Thumb → Max Price */}
        <div
          onMouseDown={() => setDragging('max')}
          className="absolute top-1/2 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-black shadow-md"
          style={{
            left: `${valueToPercent(maxValue)}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="h-2.5 w-2.5 rounded-full bg-white" />
        </div>

        {/* Left Thumb → Min Price */}
        <div
          onMouseDown={() => setDragging('min')}
          className="absolute top-1/2 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-black shadow-md"
          style={{
            left: `${valueToPercent(minValue)}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="h-2.5 w-2.5 rounded-full bg-white" />
        </div>
      </div>

      {/* Display values */}
      <div className="font-aria mt-2 flex justify-between text-[14px] font-bold">
        <span>{maxValue.toLocaleString('fa-IR')} تومان</span>
        <span>{minValue.toLocaleString('fa-IR')} تومان</span>
      </div>
    </div>
  )
}

export default PriceRangeSlider
