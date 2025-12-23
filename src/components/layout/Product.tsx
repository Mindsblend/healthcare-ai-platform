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
    console.log('[DEBUG] Added item to cart')
  }

  return (
    <div className="bg-page h-[540px] rounded-3xl border border-black/25 px-2 py-3">
      <div
        className="relative h-[404px] rounded-3xl bg-cover bg-no-repeat"
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

        <div className="absolute bottom-4 flex w-full flex-wrap items-center justify-between px-5">
          <button
            onClick={handleAddToCart}
            disabled={cartLoading}
            className="text-color-title-on-light font-ray flex h-12 cursor-pointer items-center justify-center gap-3 rounded-full bg-[#F2F2F2] pr-5 pl-2 font-medium whitespace-nowrap"
          >
            افزودن به سبد خرید
            {/* Circle with icon */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
              <Image
                src="/images/add-to-cart.svg"
                alt="Arrow"
                width={20}
                height={20}
              />
            </div>
          </button>
          <div className="text-color-title-on-dark font-ray flex h-12 items-center justify-center rounded-3xl bg-black px-7 font-extrabold">
            {product.price.toLocaleString('fa-IR')}
            <span className="pr-1">تومان</span>
          </div>
        </div>
      </div>
      <div className="mt-2.5 flex h-[106px] w-full items-center justify-between rounded-3xl bg-[#F2F2F2] px-8 py-4">
        <div className="text-color-title-on-light flex-1">
          <h1 className="font-ray text-2xl font-extrabold">{product.title}</h1>
          <p className="font-ray mt-0.5 max-w-[250px] text-sm font-medium">
            {product.solution}
          </p>
        </div>
        <Link
          href={'/products/' + product.slug}
          className="text-color-title-on-light font-ray inline-block font-black underline"
        >
          مشاهده محصول
        </Link>
      </div>
    </div>
  )
}

export default Product
