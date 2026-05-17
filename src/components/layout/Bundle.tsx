import Image from 'next/image'
import Link from 'next/link'
import { ProductSummary } from '@/features/shop/shop.types'

interface BundleProps {
  product: ProductSummary
}

const Bundle = ({ product }: BundleProps) => {
  return (
    <div className="w-full rounded-3xl border border-black/25 p-3 sm:p-4 md:p-5">
      {/* Product Image */}
      <div className="flex justify-center">
        {product.image && product.image.trim() !== '' ? (
          <div className="relative max-h-[200px] w-full sm:max-h-[250px] md:max-h-[347px]">
            <Image
              src={product.image}
              width={335}
              height={347}
              alt={product.title}
              className="h-full w-full rounded-lg object-cover"
              style={{ maxHeight: 'inherit' }}
            />
          </div>
        ) : (
          <div
            className="flex w-full items-center justify-center rounded-lg bg-gray-100"
            style={{
              height: 'clamp(200px, 30vw, 347px)',
              maxHeight: '347px',
            }}
          >
            <span className="text-sm text-gray-400">بدون تصویر</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="mt-3 sm:mt-4 md:mt-5">
        {/* Title & Description - Stacked on mobile */}
        <div className="flex flex-col gap-2 sm:gap-3">
          <h1 className="font-aria text-color-title-on-light text-lg font-bold sm:text-xl md:text-2xl">
            {product.title}
          </h1>
          <p className="font-ray text-color-title-on-light line-clamp-2 text-xs font-medium sm:line-clamp-none sm:text-sm">
            {product.solution}
          </p>
        </div>

        {/* Price & Action Section */}
        <div className="mt-3 flex flex-col gap-3 sm:mt-4 sm:flex-row sm:items-center sm:justify-between md:mt-5">
          {/* Price Info */}
          <div className="flex items-center justify-between gap-2 sm:justify-start sm:gap-2.5">
            {/* Discounted Price */}
            <h1 className="font-aria text-color-title-on-light text-sm font-extrabold line-through sm:text-base">
              543,000 تومان
            </h1>

            {/* Current Price */}
            <div className="text-color-title-on-dark font-ray flex h-9 items-center justify-center rounded-3xl bg-black px-3 text-xs font-extrabold whitespace-nowrap sm:h-10 sm:px-4 sm:text-sm md:h-12 md:px-5 md:text-base">
              {product.price.toLocaleString('fa-IR')}
              <span className="pr-1">تومان</span>
            </div>
          </div>

          {/* Action Button */}
          <Link href={`/products/${product.slug}`} className="w-full sm:w-auto">
            <button className="text-color-title-on-light font-ray flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#F2F2F2] px-3 text-xs font-medium whitespace-nowrap transition-all hover:bg-gray-200 sm:h-10 sm:gap-3 sm:pr-4 sm:pl-1 sm:text-sm md:h-12 md:text-base">
              مشاهده جزئیات پک
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white sm:h-8 sm:w-8 md:h-10 md:w-10">
                <Image
                  src="/images/arrow.svg"
                  alt="arrow"
                  width={19}
                  height={19}
                  className="h-4 w-4 sm:h-4.75 sm:w-4.75"
                />
              </div>
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Bundle
