'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { ProductSummary } from '@/features/shop/shop.types'
import { useCart } from '@/features/shop/hooks/cart/useCart'

interface Props {
  product: ProductSummary
  variant?: 'card' | 'row'
}

const Product = ({ product, variant = 'card' }: Props) => {
  const { addToCart, isAuthenticated } = useCart()

  const [isAdding, setIsAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)

  const router = useRouter()
  const productUrl = `/products/${product.slug}`

  // Use the discounted price only when it is valid and lower than
  // the original price.
  const originalPrice = Number(product.price)
  const discount = Number(product.discount ?? 0)

  const discountedPrice =
    product.discountedPrice == null ? null : Number(product.discountedPrice)

  const hasDiscount =
    Number.isFinite(originalPrice) &&
    Number.isFinite(discountedPrice) &&
    discount > 0 &&
    originalPrice > 0 &&
    discountedPrice! >= 0 &&
    discountedPrice! < originalPrice

  const displayedPrice =
    hasDiscount && discountedPrice !== null ? discountedPrice : originalPrice

  const formatPrice = (price: number) => price.toLocaleString('fa-IR')

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

  const Price = ({ compact = false }: { compact?: boolean }) => (
    <div className={`flex ${compact ? 'items-end' : 'items-start'} gap-1`}>
      <div className="flex flex-col">
        <div className="flex gap-1.5">
          {hasDiscount && (
            <span className="font-ray self-end rounded-full bg-red-100 px-1.5 py-0.5 text-xs font-bold text-red-600">
              {formatPrice(discount)}٪
            </span>
          )}
          {hasDiscount && (
            <span className="font-ray text-sm text-gray-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <span className="font-aria text-color-title-on-light flex gap-0.5 self-end text-base font-extrabold">
          {formatPrice(displayedPrice)}
          <Image src="/images/toman.svg" alt="toman" width={19} height={19} />
        </span>
      </div>
    </div>
  )

  /* ROW VARIANT */
  if (variant === 'row') {
    return (
      <article className="flex gap-3 border-b border-gray-200 py-4 first:pt-0 last:border-b-0">
        <Link
          href={productUrl}
          aria-label={`مشاهده ${product.title}`}
          className="relative block h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-gray-100"
        >
          {hasImage ? (
            <Image
              src={product.image!}
              alt={product.title}
              fill
              sizes="112px"
              className="object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-xs text-gray-400">
              بدون تصویر
            </span>
          )}
        </Link>

        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div className="text-color-title-on-light">
            <h2 className="font-ray line-clamp-2 text-[15px] leading-6 font-extrabold">
              <Link href={productUrl}>{product.title}</Link>
            </h2>

            <p className="font-ray mt-1 line-clamp-2 text-xs font-medium text-[#555555]">
              {product.solution}
            </p>
          </div>

          <div className="mt-3 flex items-end justify-between gap-2">
            <Price compact />

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding}
              aria-label={`افزودن ${product.title} به سبد خرید`}
              className="text-color-title-on-dark font-ray flex h-9 shrink-0 cursor-pointer items-center gap-1 rounded-full bg-black px-3.5 text-xs font-bold whitespace-nowrap transition hover:bg-gray-800 disabled:cursor-wait disabled:opacity-70"
            >
              {isAdding ? (
                'در حال افزودن'
              ) : (
                <>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  افزودن
                </>
              )}
            </button>
          </div>

          {addError && (
            <p role="alert" className="font-ray mt-1 text-xs text-red-600">
              {addError}
            </p>
          )}
        </div>
      </article>
    )
  }

  /* CARD VARIANT */
  return (
    <article className="bg-page xs:max-w-77.5 flex max-h-min w-full flex-col rounded-[20px] border border-black/25 p-2.5">
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

        <div className="flex w-full items-end justify-between gap-x-2 sm:items-center xl:gap-x-3">
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

          <Price />
        </div>
      </div>
    </article>
  )
}

export default Product
