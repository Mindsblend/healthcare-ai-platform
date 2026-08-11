'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Questions from '@/components/ui/Questions'
import ProductSwiper from '@/components/layout/ProductSwiper'
import { useProductBySlug } from '@/features/shop/hooks/products/useProductBySlug'
import { useProductsByCategoryId } from '@/features/shop/hooks/products/useProductsByCategoryId'
import { GainType, IconType } from '@/features/shop/shop.types'
import LoadingBar from '@/components/layout/LoadingBar'
import { useCart } from '@/features/shop/hooks/cart/useCart'

export default function ProductPage() {
  const params = useParams()
  const slug = decodeURIComponent(params.slug as string)

  const { product, loading, error } = useProductBySlug({ slug })
  const { addToCart, isAuthenticated } = useCart()

  const [isAdding, setIsAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)

  const router = useRouter()

  const { productsByCategoryId: relatedProducts, loading: relatedLoading } =
    useProductsByCategoryId({ categoryId: product?.categoryId || 0 })

  // Get the category icon path, fallback to default
  const categoryIcon = product?.category?.iconPath || '/images/makeup.svg'

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (isAdding || !product) return

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
      router.push(
        `/auth?from=${encodeURIComponent(`/products/${product.slug}`)}`,
      )
    }
  }

  return (
    <LoadingBar loading={loading} error={error}>
      {product && (
        <div className="container mt-5 sm:mt-14">
          <div className="flex items-center justify-between gap-x-6 max-lg:flex-col">
            <div className="shrink-2 max-lg:w-full max-lg:pt-5">
              <h1 className="font-aria text-color-title-on-light text-4xl font-extrabold sm:text-[40px]">
                {product.title}
              </h1>
              <div className="mt-5 flex items-center gap-x-3">
                {product.icons?.map(({ id, title, iconPath }: IconType) => (
                  <div key={id} className="flex gap-1">
                    {iconPath && iconPath.trim() !== '' ? (
                      <Image
                        src={iconPath}
                        alt={title || 'icon'}
                        width={13}
                        height={13}
                      />
                    ) : (
                      <span className="text-xs text-gray-400">بدون آیکون</span>
                    )}
                    <h1 className="font-ray text-color-title-on-light text-xs font-medium xl:text-base">
                      {title}
                    </h1>
                  </div>
                ))}
              </div>
              <p className="font-ray text-color-body-on-light mt-5 max-w-xl text-xs sm:text-sm xl:text-lg">
                {product.description}
              </p>
              <div className="bg-section mt-5 rounded-lg px-6.25 py-5.5 sm:max-w-131.25">
                <div className="flex items-center gap-1.5">
                  <Image
                    src="/images/cognition.svg"
                    alt="cognition icon"
                    width={20}
                    height={20}
                  />
                  <h1 className="font-aria text-color-title-on-dark text-sm font-semibold">
                    هوش مصنوعی
                  </h1>
                </div>
                <p className="font-ray text-color-title-on-dark mt-2.5 text-xs font-medium xl:text-sm">
                  اشکان عزیز، بر اساس اطلاعاتی که ارائه کرده‌ای و وضعیت پوستت،
                  این کرم آبرسان دقیقاً همان محصولی است که برای حل مشکل خشکی و
                  کم‌آبی پوست نیاز داری. ترکیبات گیاهی فعال و ویتامین‌های موجود
                  در این محصول، به بهبود سد دفاعی پوست و افزایش رطوبت سلولی کمک
                  می‌کنند. مطالعات نشان داده‌اند که مصرف منظم چنین ترکیبی باعث
                  کاهش التهاب‌های سطحی و افزایش انعطاف‌پذیری پوست می‌شود، که
                  دقیقاً همان چیزی است که برای نوع پوست تو توصیه می‌شود.
                </p>
              </div>
              <div className="mt-7 flex flex-col gap-5">
                {product.gains?.map(
                  ({ id, title, ingredient, description }: GainType) => (
                    <div key={id} className="flex items-center gap-1.5">
                      <Image
                        src="/images/add_circle.svg"
                        alt="add circle icon"
                        width={19.5}
                        height={19.5}
                      />
                      <h1 className="font-ray text-color-title-on-light text-xs font-medium sm:text-sm xl:text-base">
                        <span className="font-extrabold">{title}: </span>
                        {ingredient} — {description}
                      </h1>
                    </div>
                  ),
                )}
              </div>
              <div className="mt-5 flex items-center gap-3.5">
                <div className="flex w-full gap-x-5 sm:items-center">
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
            </div>
            <div className="w-full max-lg:order-first lg:max-w-xl">
              <div className="bg-page mx-auto w-full rounded-[37px] border border-black/25 p-3.5">
                {product.image && product.image.trim() !== '' ? (
                  <div
                    className="relative aspect-4/3 w-full rounded-[25px] bg-cover bg-center bg-no-repeat sm:aspect-square xl:h-full xl:w-full"
                    style={{ backgroundImage: `url(${product.image})` }}
                  >
                    <div className="bg-page absolute top-4.25 right-4.25 z-10 h-12 w-12 rounded-full p-2.25">
                      <Image
                        src={categoryIcon}
                        alt="Product icon"
                        width={30}
                        height={30}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="relative flex aspect-4/3 w-full items-center justify-center rounded-[25px] bg-gray-100 sm:aspect-square xl:h-full xl:w-full">
                    <div className="bg-page absolute top-4.25 right-4.25 z-10 h-12 w-12 rounded-full p-2.25">
                      <Image
                        src={categoryIcon}
                        alt="Product icon"
                        width={30}
                        height={30}
                      />
                    </div>
                    <span className="text-sm text-gray-400">بدون تصویر</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Questions faqs={product.faqs} />
          <div className="mt-11 flex w-full flex-col">
            <div className="text-color-title-on-light flex flex-col items-center text-center">
              <h1 className="font-aria text-3xl font-extrabold xl:text-4xl">
                محصولات مشابه
              </h1>
            </div>
            <div className="flex items-center justify-center pb-10">
              {relatedLoading ? (
                <div className="py-10 text-center">
                  در حال بارگذاری محصولات مشابه...
                </div>
              ) : (
                <ProductSwiper products={relatedProducts} />
              )}
            </div>
          </div>
        </div>
      )}
    </LoadingBar>
  )
}
