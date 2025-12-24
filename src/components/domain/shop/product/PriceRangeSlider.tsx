'use client'
import { useState } from 'react'
import { Range, getTrackBackground } from 'react-range'

const PriceRangeSlider = () => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])

  return (
    <div className="w-full space-y-2">
      <Range
        values={priceRange}
        step={10000}
        min={0}
        max={1000000}
        onChange={(values) => setPriceRange([values[0], values[1]])}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="relative h-2 w-full rounded-lg"
            style={{
              background: getTrackBackground({
                values: priceRange,
                colors: ['#ccc', '#000', '#ccc'],
                min: 0,
                max: 1000000,
              }),
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props, index }) => (
          <div
            {...props}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-black shadow-md"
          >
            <div className="h-2 w-2 rounded-full bg-white" />
          </div>
        )}
      />

      {/* Display selected range */}
      <div className="fonr-aria flex justify-between text-[12px] font-bold">
        <span>{priceRange[0]} تومان</span>
        <span>{priceRange[1]} تومان</span>
      </div>
    </div>
  )
}

export default PriceRangeSlider
