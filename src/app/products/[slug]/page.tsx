'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'

import Questions from '@/components/ui/Questions'
import ProductSwiper from '@/components/layout/ProductSwiper'
import LoadingBar from '@/components/layout/LoadingBar'

import { useProductBySlug } from '@/features/shop/hooks/products/useProductBySlug'
import { useProductsByCategoryId } from '@/features/shop/hooks/products/useProductsByCategoryId'
import { useCart } from '@/features/shop/hooks/cart/useCart'

import { GainType, IconType } from '@/features/shop/shop.types'

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()

  const slug = decodeURIComponent(params.slug as string)

  const { product, loading, error } = useProductBySlug({ slug })

  const { addToCart, isAuthenticated } = useCart()

  const [isAdding, setIsAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)

  const { productsByCategoryId: relatedProducts, loading: relatedLoading } =
    useProductsByCategoryId({
      categoryId: product?.categoryId || 0,
    })

  const categoryIcon = product?.category?.iconPath || '/images/makeup.svg'

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (isAdding || !product) return

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
  }

  return (
    <LoadingBar loading={loading} error={error}>
      {product && (
        <>
          <div className="mt-5 sm:container sm:mt-12.5">
            {/* =====================================================
                MOBILE / TABLET
                ===================================================== */}

            <div className="relative lg:hidden">
              {/* =========================
                  HERO IMAGE
                  ========================= */}

              <div className="sticky top-0 z-0 w-full">
                <div className="bg-page mx-auto w-full overflow-hidden rounded-[35px] px-6.25 pb-6.25 sm:border sm:border-black/25">
                  {product.image && product.image.trim() !== '' ? (
                    <div
                      className="relative aspect-4/3 w-full overflow-hidden rounded-[25px] bg-cover bg-center bg-no-repeat sm:aspect-square"
                      style={{
                        backgroundImage: `url(${product.image})`,
                      }}
                    ></div>
                  ) : (
                    <div className="relative flex aspect-4/3 w-full items-center justify-center rounded-[25px] bg-gray-100 sm:aspect-square">
                      <div className="bg-page absolute top-4.25 right-4.25 z-10 flex h-12 w-12 items-center justify-center rounded-full p-2.25">
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

              <div className="relative z-10 -mt-1 w-full space-y-6 rounded-t-[30px] bg-white px-4 pt-3 shadow-[0_-8px_20px_-10px_rgba(20,22,30,0.35)]">
                <div className="mx-auto mb-7 h-1.25 w-15 rounded-full bg-black/15" />

                <h1 className="font-aria text-color-title-on-light text-3xl font-extrabold sm:text-[40px]">
                  {product.title}
                </h1>

                <div className="mt-2 flex items-center gap-x-3">
                  {product.icons?.map(({ id, title, iconPath }: IconType) => (
                    <div key={id} className="flex items-center gap-1">
                      {iconPath && iconPath.trim() !== '' ? (
                        <Image
                          src={iconPath}
                          alt={title || 'icon'}
                          width={13}
                          height={13}
                        />
                      ) : (
                        <span className="text-xs text-gray-400">
                          بدون آیکون
                        </span>
                      )}

                      <span className="font-ray text-color-title-on-light text-xs font-medium sm:text-sm">
                        {title}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-7 flex flex-col gap-5">
                  {product.gains?.map(
                    ({ id, title, ingredient, description }: GainType) => (
                      <div key={id} className="flex items-start gap-1.5">
                        <Image
                          src="/images/add_circle.svg"
                          alt="add circle icon"
                          width={19.5}
                          height={19.5}
                        />

                        <p className="font-ray text-color-title-on-light text-xs leading-6 font-medium sm:text-sm">
                          <span className="font-extrabold">{title}: </span>
                          {ingredient} — {description}
                        </p>
                      </div>
                    ),
                  )}

                  <div>
                    <h1 className="font-aria text-color-title-on-light text-lg font-extrabold">
                      توضیحات
                    </h1>
                    <p className="font-ray text-color-body-on-light mt-2.5 max-w-xl text-xs leading-5 sm:text-sm">
                      {product.description}
                    </p>
                  </div>

                  <div className="font-aria text-color-title-on-light text-lg font-extrabold">
                    <h1>فروشنده</h1>
                    <div className="mt-3.75 rounded-md bg-[#F2F2F2] px-3.75 py-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="h-10 w-10 rounded-full bg-[#D9D9D9] p-2.5">
                            <Image
                              src="/images/usermd.png"
                              width={18}
                              height={18}
                              alt="police user"
                            />
                          </div>
                          <div>
                            <h1 className="font-ray text-sm font-extrabold text-black">
                              روش و هزینه ارسال
                            </h1>
                            <div className="flex items-center gap-1.25">
                              <Image
                                src="/images/check-shield.png"
                                alt="check shield"
                                width={13}
                                height={13}
                              />
                              <p className="mt-1.25 text-xs font-medium text-black">
                                توسط سایت
                              </p>
                            </div>
                          </div>
                        </div>
                        <Image
                          src="/images/chevron-left.svg"
                          alt="left arrow"
                          width={20}
                          height={20}
                        />
                      </div>

                      <hr className="my-3.75 border border-[#D9D9D9]" />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="h-10 w-10 rounded-full bg-[#D9D9D9] p-2.5">
                            <Image
                              src="/images/truck.png"
                              width={18}
                              height={18}
                              alt="truck"
                            />
                          </div>
                          <div>
                            <h1 className="font-ray text-sm font-extrabold text-black">
                              شرایط و قوانین ارسال رایگان
                            </h1>
                            <div className="flex items-center gap-1.25">
                              <Image
                                src="/images/light-bulb.png"
                                alt="light bulb"
                                width={13}
                                height={13}
                              />
                              <p className="mt-1.25 text-xs font-medium text-black">
                                قوانین
                              </p>
                            </div>
                          </div>
                        </div>
                        <Image
                          src="/images/chevron-left.svg"
                          alt="left arrow"
                          width={20}
                          height={20}
                        />
                      </div>

                      <hr className="my-3.75 border border-[#D9D9D9]" />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="h-10 w-10 rounded-full bg-[#D9D9D9] p-2.5">
                            <Image
                              src="/images/message-exclamation.png"
                              width={18}
                              height={18}
                              alt="message-exclamation"
                            />
                          </div>
                          <div>
                            <h1 className="font-ray text-sm font-extrabold text-black">
                              روش و هزینه ارسال
                            </h1>
                            <div className="flex items-center gap-1.25">
                              <Image
                                src="/images/siren.png"
                                alt="serin"
                                width={13}
                                height={13}
                              />
                              <p className="mt-1.25 text-xs font-medium text-black">
                                توسط سایت
                              </p>
                            </div>
                          </div>
                        </div>
                        <Image
                          src="/images/chevron-left.svg"
                          alt="left arrow"
                          width={20}
                          height={20}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Questions faqs={product.faqs} />
              </div>
            </div>

            {/* =====================================================
                DESKTOP
                ===================================================== */}

            <div className="hidden items-center justify-between lg:flex">
              <div className="shrink-2">
                <h1 className="font-aria text-color-title-on-light text-4xl font-extrabold sm:text-[40px]">
                  {product.title}
                </h1>

                {/* ICONS */}

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
                        <span className="text-xs text-gray-400">
                          بدون آیکون
                        </span>
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

                {addError && (
                  <p className="font-ray mt-3 text-sm text-red-500">
                    {addError}
                  </p>
                )}
              </div>

              <div className="w-full lg:max-w-xl">
                <div className="bg-page mx-auto w-full overflow-hidden rounded-[35px] px-6.25 pb-6.25 sm:border sm:border-black/25">
                  {product.image && product.image.trim() !== '' ? (
                    <div
                      className="relative aspect-square w-full rounded-[25px] bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundImage: `url(${product.image})`,
                      }}
                    >
                      <div className="bg-page absolute top-4.25 right-4.25 z-10 flex h-12 w-12 items-center justify-center rounded-full p-2.25">
                        <Image
                          src={categoryIcon}
                          alt="Product icon"
                          width={25}
                          height={25}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex aspect-square w-full items-center justify-center rounded-[25px] bg-gray-100">
                      <div className="bg-page absolute top-4.25 right-4.25 z-10 flex h-12 w-12 items-center justify-center rounded-full p-2.25">
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

              {/* Question */}

              <Questions faqs={product.faqs} />
            </div>

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

          <div className="fixed right-0 bottom-0 left-0 z-50 lg:hidden">
            <div className="bg-white/95 px-6 py-3 shadow-[0_-8px_30px_rgba(20,22,30,0.12)] backdrop-blur-md">
              <div className="flex items-center justify-between gap-4">
                {/* BUTTON */}

                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  aria-label={`افزودن ${product.title} به سبد خرید`}
                  className="text-color-title-on-dark font-ray flex h-11 w-[150px] cursor-pointer items-center justify-center rounded-[5px] bg-black px-5 text-sm font-medium transition hover:bg-gray-800 disabled:cursor-wait disabled:opacity-70"
                >
                  {isAdding ? 'در حال افزودن...' : 'افزودن به سبد خرید'}
                </button>

                {/* PRICE */}

                <div className="text-color-title-on-light font-ray flex shrink-0 items-end text-base font-extrabold max-sm:flex-col">
                  {product.price.toLocaleString('fa-IR')}

                  <span className="pr-1">تومان</span>
                </div>
              </div>

              {addError && (
                <p className="font-ray mt-2 text-center text-xs text-red-500">
                  {addError}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </LoadingBar>
  )
}
