import Image from 'next/image'
import Link from 'next/link'
import { ProductPreviewType } from '../types/types'
import { useCart } from '@/features/shop/hooks/cart/useCart'

interface Props {
  product: ProductPreviewType
}

const Product = ({ product }: Props) => {
  const { addToCart, loading: cartLoading } = useCart()

  const handleAddToCart = async () => {
    if (cartLoading) return
    await addToCart(product.id, 1)
  }

  return (
    <div className="bg-page flex w-full flex-col rounded-[22px] border border-black/25 p-2.5">
      {/* Image Section */}
      <div
        className="relative aspect-square w-full rounded-3xl bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${product.image})` }}
      >
        <div className="bg-page absolute top-3.5 right-4 z-10 h-12 w-12 rounded-full p-2.5">
          <Image
            src="/images/makeup.svg"
            alt="Product icon"
            width={30}
            height={30}
          />
        </div>

        {/* Bottom Actions */}
        <div className="absolute bottom-1 flex w-full flex-col gap-y-1 px-1 sm:flex-row sm:items-center sm:justify-between lg:bottom-2 lg:px-2">
          <button
            onClick={handleAddToCart}
            disabled={cartLoading}
            className="text-color-title-on-light font-ray flex h-10 w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-[#F2F2F2] pr-4 pl-1 text-sm font-medium whitespace-nowrap sm:w-auto 2xl:h-12 2xl:pr-5 2xl:text-base"
          >
            افزودن به سبد خرید
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white 2xl:h-10 2xl:w-10">
              <Image
                src="/images/add-to-cart.svg"
                alt="Add to cart"
                width={20}
                height={20}
              />
            </div>
          </button>

          <div className="text-color-title-on-dark font-ray flex h-10 w-full items-center justify-center rounded-3xl bg-black px-5 text-sm font-extrabold sm:w-auto 2xl:h-12 2xl:px-7 2xl:text-base">
            {product.price.toLocaleString('fa-IR')}
            <span className="pr-1">تومان</span>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-2.5 flex grow flex-col gap-3 rounded-3xl bg-[#F2F2F2] px-6 py-4 lg:justify-between">
        <div className="text-color-title-on-light">
          <h1 className="font-ray text-lg font-extrabold sm:text-xl">
            {product.title}
          </h1>
          <p className="font-ray mt-0.5 text-xs font-medium sm:max-w-75 sm:text-sm">
            {product.solution}
          </p>
        </div>

        <Link
          href={'/products/' + product.slug}
          className="text-color-title-on-light font-ray inline-block shrink-0 self-start font-black underline sm:self-auto"
        >
          مشاهده محصول
        </Link>
      </div>
    </div>
  )
}

export default Product
