import Image from 'next/image'
import Link from 'next/link'
import { ProductSummary } from '@/features/shop/shop.types'
import { useCart } from '@/features/shop/hooks/cart/useCart'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
  product: ProductSummary
}

const Product = ({ product }: Props) => {
  const { addToCart, isAuthenticated } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)

  const router = useRouter()

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (isAdding) return

    if (isAuthenticated) {
      setIsAdding(true)
      setAddError(null)

      try {
        await addToCart(product.id, 1)
      } catch {
        setAddError('افزودن به سبد خرید ناموفق بود. دوباره تلاش کنید.')
      } finally {
        setIsAdding(false)
      }
    } else {
      router.push(`/auth?from=${encodeURIComponent('/products')}`)
    }
  }

  // Get the category icon path, fallback to default
  const categoryIcon = product.category?.iconPath || '/images/makeup.webp'

  return (
    <Link
      href={'/products/' + product.slug}
      className="bg-page flex max-h-min w-full flex-col rounded-[20px] border border-black/25 p-2.5"
    >
      {/* Image Section */}
      {product.image && product.image.trim() !== '' ? (
        <div
          className="relative aspect-square w-full rounded-[16.5px] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${product.image})` }}
        >
          <div className="bg-page absolute top-3.5 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full p-2.5">
            <Image
              src={categoryIcon}
              alt="Product icon"
              width={20}
              height={20}
            />
          </div>
        </div>
      ) : (
        <div className="relative flex aspect-square w-full items-center justify-center rounded-[16.5px] bg-gray-100">
          <div className="bg-page absolute top-3.5 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full p-2.5">
            <Image
              src={categoryIcon}
              alt="Product icon"
              width={20}
              height={20}
            />
          </div>

          <span className="text-sm text-gray-400">بدون تصویر</span>

          {/* Bottom Actions */}
          <div className="absolute bottom-1 flex w-full flex-col gap-y-1 px-1 sm:flex-row sm:items-center sm:justify-between lg:bottom-2 lg:px-2">
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              aria-label={`افزودن ${product.title} به سبد خرید`}
              className="text-color-title-on-dark font-ray flex h-10 w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-black pr-4 pl-1 text-sm font-medium whitespace-nowrap transition hover:bg-gray-800 disabled:cursor-wait disabled:opacity-70 sm:w-auto 2xl:h-12 2xl:pr-5 2xl:text-base"
            >
              {isAdding ? 'در حال افزودن...' : 'افزودن به سبد خرید'}
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white 2xl:h-10 2xl:w-10">
                <Image
                  src="/images/add-to-cart.svg"
                  alt="Add to cart"
                  width={20}
                  height={20}
                />
              </div>
            </button>

            <div className="text-color-title-on-light font-ray flex h-10 w-full items-center justify-center rounded-[16.5px] bg-[#F2F2F2] px-5 text-sm font-extrabold sm:w-auto 2xl:h-12 2xl:px-7 2xl:text-base">
              {product.price.toLocaleString('fa-IR')}
              <span className="pr-1">تومان</span>
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-2.5 flex flex-col gap-4 rounded-[16.5px] bg-[#F2F2F2] px-6 py-4 lg:justify-between">
        <div className="text-color-title-on-light">
          <h1 className="font-ray text-lg font-extrabold sm:text-xl">
            {product.title}
          </h1>
          <p className="font-ray mt-0.5 text-xs font-medium text-[#555555] sm:max-w-75 sm:text-sm">
            {product.solution}
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="flex w-full justify-between gap-x-5 sm:items-center">
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            aria-label={`افزودن ${product.title} به سبد خرید`}
            className="text-color-title-on-dark font-ray flex h-10 w-auto cursor-pointer items-center justify-center gap-3 rounded-full bg-black px-4 text-sm font-medium whitespace-nowrap transition hover:bg-gray-800 disabled:cursor-wait disabled:opacity-70 2xl:h-12 2xl:text-base"
          >
            {isAdding ? 'در حال افزودن...' : 'افزودن به سبد خرید'}
          </button>

          <div className="text-color-title-on-light font-ray flex items-center justify-center text-sm font-extrabold 2xl:text-base">
            {product.price.toLocaleString('fa-IR')}
            <span className="pr-1">تومان</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Product
