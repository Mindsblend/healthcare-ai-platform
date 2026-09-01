'use client'

import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

import Questions from '@/components/ui/Questions'
import LoadingBar from '@/components/layout/LoadingBar'

import { useProductBySlug } from '@/features/shop/hooks/products/useProductBySlug'
import { useProductsByCategoryId } from '@/features/shop/hooks/products/useProductsByCategoryId'
import { useCart } from '@/features/shop/hooks/cart/useCart'

import { GainType, IconType } from '@/features/shop/shop.types'

const ProductSwiper = dynamic(
  () => import('@/components/layout/ProductSwiper'),
  {
    loading: () => (
      <div
        className="flex min-h-[280px] items-center justify-center"
        aria-label="در حال بارگذاری محصولات مشابه"
      />
    ),
  },
)

function ProductImage({
  src,
  alt,
  categoryIcon,
  mobile = false,
  priority = false,
}: {
  src?: string | null
  alt: string
  categoryIcon: string
  mobile?: boolean
  priority?: boolean
}) {
  const hasImage = Boolean(src?.trim())

  return (
    <div
      className={
        mobile
          ? 'bg-page relative aspect-square w-full overflow-hidden rounded-[35px]'
          : 'bg-page relative aspect-square w-full overflow-hidden rounded-[25px]'
      }
    >
      {hasImage ? (
        <Image
          src={src!}
          alt={alt}
          fill
          priority={priority}
          fetchPriority={priority ? 'high' : 'auto'}
          sizes={
            mobile ? 'calc(100vw - 3rem)' : '(max-width: 1280px) 384px, 384px'
          }
          className="object-contain"
        />
      ) : (
        <>
          <div className="bg-page absolute top-4.25 right-4.25 z-10 flex items-center justify-center rounded-full p-2.25">
            <Image
              src={categoryIcon}
              alt=""
              width={mobile ? 30 : 20}
              height={mobile ? 30 : 20}
              sizes={`${mobile ? 30 : 20}px`}
            />
          </div>

          <div className="flex h-full w-full items-center justify-center">
            <span className="text-sm text-gray-400">بدون تصویر</span>
          </div>
        </>
      )}
    </div>
  )
}

function ProductIcons({
  icons,
  mobile = false,
}: {
  icons?: IconType[]
  mobile?: boolean
}) {
  if (!icons?.length) return null

  return (
    <div
      className={
        mobile
          ? 'mt-2 flex flex-wrap items-center gap-x-3 gap-y-2'
          : 'mt-3 flex flex-wrap items-center gap-x-3 gap-y-2'
      }
    >
      {icons.map(({ id, title, iconPath }) => (
        <div key={id} className="flex items-center gap-1">
          {iconPath?.trim() ? (
            <Image src={iconPath} alt="" width={13} height={13} sizes="13px" />
          ) : null}

          <span
            className={
              mobile
                ? 'font-ray text-color-title-on-light text-xs font-medium sm:text-sm'
                : 'font-ray text-color-title-on-light text-xs font-medium xl:text-base'
            }
          >
            {title}
          </span>
        </div>
      ))}
    </div>
  )
}

function ProductGains({
  gains,
  mobile = false,
}: {
  gains?: GainType[]
  mobile?: boolean
}) {
  if (!gains?.length) return null

  return (
    <div
      className={
        mobile ? 'mt-7 flex flex-col gap-5' : 'mt-5 flex flex-col gap-5'
      }
    >
      {gains.map(({ id, title, ingredient, description }) => (
        <div
          key={id}
          className={
            mobile ? 'flex items-start gap-1.5' : 'flex items-center gap-1.5'
          }
        >
          <Image
            src="/images/add_circle.svg"
            alt=""
            width={19}
            height={19}
            sizes="19px"
          />

          <p
            className={
              mobile
                ? 'font-ray text-color-title-on-light text-xs leading-6 font-medium sm:text-sm'
                : 'font-ray text-color-title-on-light text-xs font-medium sm:text-sm xl:text-base'
            }
          >
            <span className="font-extrabold">{title}: </span>
            {ingredient} — {description}
          </p>
        </div>
      ))}
    </div>
  )
}

function SellerInfo() {
  return (
    <div className="w-full rounded-md bg-[#F2F2F2] px-3.75 py-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D9D9D9] p-2.5">
            <Image
              src="/images/usermd.svg"
              width={18}
              height={18}
              alt=""
              sizes="18px"
            />
          </div>

          <div>
            <h3 className="font-ray text-sm font-extrabold text-black">
              روش و هزینه ارسال
            </h3>

            <div className="flex items-center gap-1.25">
              <Image
                src="/images/check-shield.svg"
                alt=""
                width={13}
                height={13}
                sizes="13px"
              />

              <p className="mt-1.25 text-xs font-medium text-black">
                توسط سایت
              </p>
            </div>
          </div>
        </div>

        <Image
          src="/images/chevron-left.svg"
          alt=""
          width={20}
          height={20}
          sizes="20px"
        />
      </div>

      <hr className="my-3.75 border border-[#D9D9D9]" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D9D9D9] p-2.5">
            <Image
              src="/images/truck.svg"
              width={18}
              height={18}
              alt=""
              sizes="18px"
            />
          </div>

          <div>
            <h3 className="font-ray text-sm font-extrabold text-black">
              شرایط و قوانین ارسال رایگان
            </h3>

            <div className="flex items-center gap-1.25">
              <Image
                src="/images/light-bulb.svg"
                alt=""
                width={13}
                height={13}
                sizes="13px"
              />

              <p className="mt-1.25 text-xs font-medium text-black">قوانین</p>
            </div>
          </div>
        </div>

        <Image
          src="/images/chevron-left.svg"
          alt=""
          width={20}
          height={20}
          sizes="20px"
        />
      </div>

      <hr className="my-3.75 border border-[#D9D9D9]" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D9D9D9] p-2.5">
            <Image
              src="/images/message-exclamation.svg"
              width={18}
              height={18}
              alt=""
              sizes="18px"
            />
          </div>

          <div>
            <h3 className="font-ray text-sm font-extrabold text-black">
              روش و هزینه ارسال
            </h3>

            <div className="flex items-center gap-1.25">
              <Image
                src="/images/siren.svg"
                alt=""
                width={13}
                height={13}
                sizes="13px"
              />

              <p className="mt-1.25 text-xs font-medium text-black">
                توسط سایت
              </p>
            </div>
          </div>
        </div>

        <Image
          src="/images/chevron-left.svg"
          alt=""
          width={20}
          height={20}
          sizes="20px"
        />
      </div>
    </div>
  )
}

function AddToCartButton({
  productTitle,
  isAdding,
  onClick,
  mobile = false,
}: {
  productTitle: string
  isAdding: boolean
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  mobile?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isAdding}
      aria-label={`افزودن ${productTitle} به سبد خرید`}
      className={
        mobile
          ? 'text-color-title-on-dark font-ray flex h-11 w-37.5 shrink-0 cursor-pointer items-center justify-center rounded-[5px] bg-black px-5 text-sm font-medium transition-colors hover:bg-gray-800 disabled:cursor-wait disabled:opacity-70'
          : 'text-color-title-on-dark font-ray flex h-10 w-45 shrink-0 cursor-pointer items-center justify-center gap-3 rounded-full bg-black px-4 text-sm font-medium whitespace-nowrap transition-colors hover:bg-gray-800 disabled:cursor-wait disabled:opacity-70 2xl:h-12 2xl:text-base'
      }
    >
      {isAdding ? 'در حال افزودن...' : 'افزودن به سبد خرید'}
    </button>
  )
}

function ProductPrice({
  price,
  mobile = false,
}: {
  price: number
  mobile?: boolean
}) {
  return (
    <div
      className={
        mobile
          ? 'text-color-title-on-light font-ray flex shrink-0 items-center text-lg font-bold'
          : 'text-color-title-on-light font-ray flex items-center justify-center text-sm font-extrabold 2xl:text-base'
      }
    >
      {price.toLocaleString('fa-IR')}

      <Image
        src="/images/toman.svg"
        width={25}
        height={25}
        className="pr-1"
        alt="toman"
      />
    </div>
  )
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()

  const slug = decodeURIComponent(params.slug as string)

  const { product, loading, error } = useProductBySlug({
    slug,
  })

  const { addToCart, isAuthenticated } = useCart()

  const [isAdding, setIsAdding] = useState(false)

  const [addError, setAddError] = useState<string | null>(null)

  const categoryId = product?.categoryId ?? 0

  const { productsByCategoryId: relatedProducts, loading: relatedLoading } =
    useProductsByCategoryId({
      categoryId,
    })

  const categoryIcon = product?.category?.iconPath || '/images/makeup.svg'

  const handleAddToCart = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      if (isAdding || !product) {
        return
      }

      if (!isAuthenticated) {
        router.push(
          `/auth?from=${encodeURIComponent(`/products/${product.slug}`)}`,
        )

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
    },
    [addToCart, isAdding, isAuthenticated, product, router],
  )

  return (
    <LoadingBar loading={loading} error={error}>
      {product ? (
        <>
          <main className="mt-5 sm:mt-12.5">
            {/* =========================
                MOBILE
            ========================== */}
            <section className="relative lg:hidden">
              <div className="sticky top-0 z-0 w-full">
                <div className="bg-page mx-auto w-full overflow-hidden rounded-[35px] px-6.25 pb-6.25">
                  <ProductImage
                    src={product.image}
                    alt={product.title}
                    categoryIcon={categoryIcon}
                    mobile
                    priority
                  />
                </div>
              </div>

              <div className="relative z-10 -mt-1 w-full space-y-6 rounded-t-[30px] bg-white px-4 pt-3 shadow-[0_-8px_20px_-10px_rgba(20,22,30,0.35)]">
                <div className="mx-auto mb-7 h-1.25 w-15 rounded-full bg-black/15" />

                <h1 className="font-aria text-color-title-on-light text-3xl font-extrabold sm:text-[40px]">
                  {product.title}
                </h1>

                <ProductIcons icons={product.icons} mobile />

                <ProductGains gains={product.gains} mobile />

                <div>
                  <h2 className="font-aria text-color-title-on-light text-lg font-extrabold">
                    توضیحات
                  </h2>

                  <p className="font-ray text-color-body-on-light mt-2.5 max-w-xl text-xs leading-5 sm:text-sm">
                    {product.description}
                  </p>
                </div>

                <div className="font-aria text-color-title-on-light text-lg font-extrabold">
                  <h2>فروشنده</h2>

                  <div className="mt-3.75">
                    <SellerInfo />
                  </div>
                </div>

                <Questions faqs={product.faqs} />
              </div>
            </section>

            {/* =========================
                DESKTOP
            ========================== */}
            <section className="container hidden lg:flex lg:flex-col lg:items-center">
              <div className="flex w-full items-center justify-between gap-5">
                {/* Product image */}
                <div className="w-full max-w-sm">
                  <ProductImage
                    src={product.image}
                    alt={product.title}
                    categoryIcon={categoryIcon}
                  />
                </div>

                {/* Product information */}
                <div className="max-xl:max-w-[430px]">
                  <h1 className="font-aria text-color-title-on-light text-2xl font-extrabold sm:text-[32px]">
                    {product.title}
                  </h1>

                  <ProductIcons icons={product.icons} />

                  <ProductGains gains={product.gains} />

                  <div className="mt-5">
                    <h2 className="font-aria text-xl font-extrabold text-black">
                      توضیحات
                    </h2>

                    <p className="font-ray text-color-body-on-light mt-2.5 max-w-xl text-xs sm:text-sm xl:text-base">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Seller + cart */}
                <div className="flex w-full max-w-[400px] min-w-[300px] flex-1 flex-col items-center gap-4.5">
                  <div className="font-aria text-color-title-on-light w-full text-lg font-extrabold">
                    <h2>فروشنده</h2>

                    <div className="mt-3.75">
                      <SellerInfo />
                    </div>
                  </div>

                  <div className="flex w-full justify-between gap-x-5 sm:items-center">
                    <AddToCartButton
                      productTitle={product.title}
                      isAdding={isAdding}
                      onClick={handleAddToCart}
                    />

                    <ProductPrice price={product.price} />
                  </div>

                  {addError && (
                    <p className="font-ray mt-3 text-sm text-red-500">
                      {addError}
                    </p>
                  )}
                </div>
              </div>

              <Questions faqs={product.faqs} />
            </section>

            {/* =========================
                RELATED PRODUCTS
            ========================== */}
            <section className="container mt-11 flex w-full flex-col">
              <div className="text-color-title-on-light flex flex-col">
                <h2 className="font-aria text-2xl font-extrabold xl:text-[32px]">
                  محصولات مشابه
                </h2>
              </div>

              <div className="flex min-h-[280px] items-center justify-center pb-10">
                {relatedLoading ? (
                  <div className="py-10 text-center" aria-live="polite">
                    در حال بارگذاری محصولات مشابه...
                  </div>
                ) : relatedProducts?.length ? (
                  <ProductSwiper products={relatedProducts} />
                ) : null}
              </div>
            </section>
          </main>

          {/* =========================
              MOBILE STICKY CART
          ========================== */}
          <div className="fixed right-0 bottom-0 left-0 z-50 lg:hidden">
            <div className="bg-white/95 px-6 py-3 shadow-[0_-8px_30px_rgba(20,22,30,0.12)] backdrop-blur-md">
              <div className="flex items-center justify-between gap-4">
                <AddToCartButton
                  productTitle={product.title}
                  isAdding={isAdding}
                  onClick={handleAddToCart}
                  mobile
                />

                <ProductPrice price={product.price} mobile />
              </div>

              {addError && (
                <p className="font-ray mt-2 text-center text-xs text-red-500">
                  {addError}
                </p>
              )}
            </div>
          </div>
        </>
      ) : null}
    </LoadingBar>
  )
}
