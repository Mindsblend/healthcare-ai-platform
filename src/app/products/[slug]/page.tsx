'use client'

import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Questions from '@/components/ui/Qustions'
import ProductSwiper from '@/components/layout/ProductSwiper'
import { useProductBySlug } from '@/features/shop/hooks/products/useProductBySlug'
import { useProductsByCategoryId } from '@/features/shop/hooks/products/useProductsByCategoryId'
import { gainType, iconType } from '@/components/types/types'

export default function ProductPage() {
  const params = useParams()
  const slug = decodeURIComponent(params.slug as string)

  const {
    product,
    loading: productLoading,
    error: productError,
  } = useProductBySlug(slug)
  const { productsByCategoryId: relatedProducts, loading: relatedLoading } =
    useProductsByCategoryId(product?.categoryId || 0)

  if (productLoading) {
    return (
      <div className="container flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری محصول...</p>
        </div>
      </div>
    )
  }

  if (productError || !product) {
    return (
      <div className="container flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">محصول پیدا نشد</h2>
          <p className="mt-2 text-gray-600">
            محصول مورد نظر شما موجود نمی‌باشد.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="flex items-center justify-between gap-x-6 max-lg:flex-col">
        <div className="shrink-2 max-lg:w-full max-lg:pt-5">
          <h1 className="font-aria text-color-title-on-light text-4xl font-extrabold sm:text-[40px]">
            {product.title}
          </h1>
          <div className="mt-5 flex items-center gap-x-3">
            {product.icons?.map(({ id, title, iconPath }: iconType) => (
              <div key={id} className="flex gap-1">
                <Image
                  src={iconPath ?? '/images/close.svg'}
                  alt="earbuds icon"
                  width={13}
                  height={13}
                />
                <h1 className="font-ray text-color-title-on-light text-xs font-medium xl:text-base">
                  {title}
                </h1>
              </div>
            ))}
          </div>
          <p className="font-ray text-color-body-on-light mt-5 max-w-xl text-xs sm:text-sm xl:text-lg">
            {product.description}
          </p>
          <div className="bg-section mt-5 max-w-131.25 rounded-lg px-6.25 py-5.5">
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
              اشکان عزیز، بر اساس اطلاعاتی که ارائه کرده‌ای و وضعیت پوستت، این
              کرم آبرسان دقیقاً همان محصولی است که برای حل مشکل خشکی و کم‌آبی
              پوست نیاز داری. ترکیبات گیاهی فعال و ویتامین‌های موجود در این
              محصول، به بهبود سد دفاعی پوست و افزایش رطوبت سلولی کمک می‌کنند.
              مطالعات نشان داده‌اند که مصرف منظم چنین ترکیبی باعث کاهش
              التهاب‌های سطحی و افزایش انعطاف‌پذیری پوست می‌شود، که دقیقاً همان
              چیزی است که برای نوع پوست تو توصیه می‌شود.
            </p>
          </div>
          <div className="mt-7 flex flex-col gap-5">
            {product.gains?.map(
              ({ id, title, ingredient, description }: gainType) => (
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
            <Link
              href="/"
              className="primary-btn text-color-title-on-light font-ray flex items-center justify-between rounded-full bg-[#F2F2F2] font-medium whitespace-nowrap"
            >
              <span className="pr-2">افزودن به سبد خرید</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white xl:h-10 xl:w-10">
                <Image
                  src="/images/add-to-cart.svg"
                  alt="Arrow"
                  width={20}
                  height={20}
                  className="max-xl:h-3.75 max-xl:w-3.75"
                />
              </div>
            </Link>
            <Link
              href="/"
              className="secondary-btn text-color-title-on-dark flex items-center justify-center rounded-full bg-black font-extrabold"
            >
              {product.price?.toLocaleString('fa-IR')}
              <span className="pr-1">تومان</span>
            </Link>
          </div>
        </div>
        <div className="w-full max-lg:order-first lg:max-w-xl">
          <div className="bg-page mx-auto w-full rounded-[37px] border border-black/25 p-3.5">
            <div
              className="relative aspect-4/3 w-full rounded-[25px] bg-cover bg-center bg-no-repeat sm:aspect-square xl:h-full xl:w-full"
              style={{ backgroundImage: `url(${product.image})` }}
            >
              <div className="bg-page absolute top-4.25 right-4.25 z-10 h-12 w-12 rounded-full p-2.25">
                <Image
                  src="/images/makeup.svg"
                  alt="Product icon"
                  width={30}
                  height={30}
                />
              </div>
            </div>
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
  )
}
