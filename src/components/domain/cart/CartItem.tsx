'use client'

import Image from 'next/image'
import { useState } from 'react'

type CartItemProps = {
  id: number
  title: string
  solution: string
  count: number
  price: number
  discount?: number | null
  discountedPrice?: number | null
  image: string
  onUpdateQuantity: (id: number, quantity: number) => void
  onRemove: (id: number) => Promise<void>
}

const CartItem = ({
  id,
  title,
  solution,
  count,
  price,
  discount = 0,
  discountedPrice = null,
  image,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) => {
  const [isRemoving, setIsRemoving] = useState(false)

  const hasDiscount =
    typeof discount === 'number' &&
    discount > 0 &&
    typeof discountedPrice === 'number' &&
    discountedPrice >= 0 &&
    discountedPrice < price

  const finalPrice = hasDiscount ? discountedPrice : price

  const formatPrice = (value: number) => value.toLocaleString('fa-IR')

  const totalSavings = (price - finalPrice) * count

  const handleIncrement = () => {
    if (isRemoving) return
    onUpdateQuantity(id, count + 1)
  }

  const handleDecrement = () => {
    if (isRemoving || count <= 1) return
    onUpdateQuantity(id, count - 1)
  }

  const handleRemove = async () => {
    if (isRemoving) return

    setIsRemoving(true)

    try {
      await onRemove(id)
    } catch {
      setIsRemoving(false)
    }
  }

  const PriceDisplay = ({ compact = false }: { compact?: boolean }) => (
    <div className={`flex ${compact ? 'items-end' : 'items-start'} gap-1`}>
      <div className="flex flex-col">
        <div>
          {hasDiscount && (
            <span className="mr-2 self-end rounded-full bg-red-100 px-1.5 py-0.5 text-xs font-bold text-red-600">
              {formatPrice(discount)}٪
            </span>
          )}
          {hasDiscount && (
            <span className="font-ray text-sm text-gray-400 line-through">
              {formatPrice(price)}
            </span>
          )}
        </div>

        <span className="flex self-end gap-0.5 font-aria text-color-title-on-light text-base font-extrabold">
          {formatPrice(finalPrice)}
          <Image src='/images/toman.svg' alt='toman' width={19} height={19} />
        </span>
      </div>
    </div>
  )

  return (
    <div
      className={`border-b px-4 py-3 last:border-b-0 xl:px-8 ${
        isRemoving ? 'pointer-events-none opacity-50' : ''
      }`}
    >
      {/* Mobile & Tablet */}
      <div className="flex flex-col gap-3 lg:hidden">
        <div className="flex gap-5">
          {image?.trim() ? (
            <Image
              src={image}
              alt={title}
              width={80}
              height={80}
              className="h-20 w-20 rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100">
              <span className="text-xs text-gray-400">بدون تصویر</span>
            </div>
          )}

          <div className="min-w-0">
            <h2 className="font-aria text-color-title-on-light text-lg font-bold">
              {title}
            </h2>

            <p className="font-ray text-color-body-on-light mt-1 line-clamp-2 text-sm font-medium">
              {solution}
            </p>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex h-9 w-20.25 shrink-0 items-center justify-between overflow-hidden rounded-3xl bg-[#f2f2f2] text-center">
              <button
                onClick={handleDecrement}
                disabled={count <= 1 || isRemoving}
                aria-label="کاهش تعداد"
                className="flex h-7 w-7 items-center justify-center transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Image
                  src="/images/minimize.svg"
                  alt=""
                  width={10}
                  height={10}
                />
              </button>

              <span className="text-color-title-on-light font-aria text-center text-sm font-extrabold">
                {count.toLocaleString('fa-IR')}
              </span>

              <button
                onClick={handleIncrement}
                disabled={isRemoving}
                aria-label="افزایش تعداد"
                className="flex h-7 w-7 items-center justify-center transition hover:bg-gray-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Image
                  src="/images/add.svg"
                  alt="add icon"
                  width={10}
                  height={10}
                />
              </button>
            </div>

            <div className="flex min-w-0 items-center gap-8">
              <PriceDisplay compact />

              <button
                onClick={handleRemove}
                disabled={isRemoving}
                className="shrink-0 cursor-pointer disabled:cursor-not-allowed"
                aria-label={`حذف ${title} از سبد خرید`}
              >
                <Image src="/images/delete.svg" alt="" width={20} height={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:grid lg:grid-cols-[2fr_1fr_1fr_40px] lg:items-center lg:gap-3">
        <div className="flex items-center">
          {image?.trim() ? (
            <Image
              src={image}
              alt={title}
              width={80}
              height={80}
              className="h-20 w-20 rounded-3xl object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-100">
              <span className="text-xs text-gray-400">بدون تصویر</span>
            </div>
          )}

          <div className="mr-6 min-w-0">
            <h2 className="font-aria text-color-title-on-light font-bold xl:font-extrabold">
              {title}
            </h2>

            <p className="font-ray text-color-body-on-light mt-1.5 line-clamp-2 max-w-40 text-sm font-medium">
              {solution}
            </p>
          </div>
        </div>

        <div className="flex h-10 w-24 items-center justify-between overflow-hidden rounded-3xl bg-[#f2f2f2] text-center">
          <button
            onClick={handleIncrement}
            disabled={isRemoving}
            aria-label="افزایش تعداد"
            className="flex h-8 w-8 cursor-pointer items-center justify-center pr-2 transition hover:bg-gray-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Image src="/images/add.svg" alt="" width={10} height={10} />
          </button>

          <span className="text-color-title-on-light font-aria text-center font-extrabold">
            {count.toLocaleString('fa-IR')}
          </span>

          <button
            disabled={count <= 1 || isRemoving}
            onClick={handleDecrement}
            aria-label="کاهش تعداد"
            className="flex h-8 w-8 cursor-pointer items-center justify-center pl-2 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Image src="/images/minimize.svg" alt="" width={10} height={10} />
          </button>
        </div>

        <PriceDisplay />

        <div className="flex items-center justify-center">
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="cursor-pointer disabled:cursor-not-allowed"
            aria-label={`حذف ${title} از سبد خرید`}
          >
            <Image src="/images/delete.svg" alt="" width={24} height={24} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartItem
