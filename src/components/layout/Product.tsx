'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { ProductSummary } from '@/features/shop/shop.types'
import { useCart } from '@/features/shop/hooks/cart/useCart'

interface Props {
  product: ProductSummary
}

const Product = ({ product }: Props) => {
  const { addToCart, isAuthenticated } = useCart()

  const [isAdding, setIsAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)

  const router = useRouter()

  const productUrl = `/products/${product.slug}`

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (isAdding) return

    if (!isAuthenticated) {
      router.push(`/auth?from=${encodeURIComponent(productUrl)}`)
      return
    }

    setIsAdding(true)
    setAddError(null)

    try {
      await addToCart(product.id, 1)
    } catch {
      setAddError('افزودن به سبد خرید ناموفق بود. دوباره تلاش کنید.')
    } finally {
      setIsAdding(false)
    }
  }

  const categoryIcon = product.category?.iconPath || '/images/makeup.webp'

  const hasImage = Boolean(product.image) && product.image.trim() !== ''

  return (
    <article className="bg-page xs:max-w-77.5 flex max-h-min w-full flex-col rounded-[20px] border border-black/25 p-2.5">
      {/* Product Image */}
      <Link
        href={productUrl}
        aria-label={`مشاهده ${product.title}`}
        className="block"
      >
        {hasImage ? (
          <div className="relative aspect-square w-full overflow-hidden rounded-[16.5px]">
            <Image
              src={product.image!}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
              className="object-cover"
            />

            <div
              className="bg-page absolute top-3.5 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full p-2.5"
              aria-hidden="true"
            >
              <Image src={categoryIcon} alt="" width={20} height={20} />
            </div>
          </div>
        ) : (
          <div className="relative flex aspect-square w-full items-center justify-center rounded-[16.5px] bg-gray-100">
            <div
              className="bg-page absolute top-3.5 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full p-2.5"
              aria-hidden="true"
            >
              <Image src={categoryIcon} alt="" width={20} height={20} />
            </div>

            <span className="text-sm text-gray-400">بدون تصویر</span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="mt-2.5 flex flex-col gap-4 rounded-[16.5px] bg-[#F2F2F2] px-3 py-3 sm:px-5 sm:py-4 lg:justify-between">
        <div className="text-color-title-on-light">
          <h2 className="font-ray text-lg font-extrabold sm:text-xl">
            <Link
              href={productUrl}
              className="transition-opacity hover:opacity-80"
            >
              {product.title}
            </Link>
          </h2>

          <p className="font-ray mt-0.5 text-xs font-medium text-[#555555] sm:max-w-75 sm:text-sm">
            {product.solution}
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="flex w-full justify-between gap-x-1 sm:items-center xl:gap-x-3">
          <div className="flex flex-col items-start gap-1">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding}
              aria-label={`افزودن ${product.title} به سبد خرید`}
              className="text-color-title-on-dark font-ray flex h-10 w-auto cursor-pointer items-center justify-center gap-3 rounded-full bg-black px-4 text-sm font-medium whitespace-nowrap transition hover:bg-gray-800 disabled:cursor-wait disabled:opacity-70 2xl:h-12 2xl:text-base"
            >
              {isAdding ? 'در حال افزودن...' : 'افزودن به سبد خرید'}
            </button>

            {addError && (
              <p role="alert" className="font-ray text-xs text-red-600">
                {addError}
              </p>
            )}
          </div>

          <div
            className="text-color-title-on-light font-ray flex items-center justify-center text-sm font-extrabold 2xl:text-base"
            aria-label={`${product.price.toLocaleString('fa-IR')} تومان`}
          >
            {product.price.toLocaleString('fa-IR')}

            <span className="pr-1">
              <Image
                src="/images/toman.svg"
                alt=""
                aria-hidden="true"
                width={20}
                height={20}
              />
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}

export default Product
