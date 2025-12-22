import Image from 'next/image'
import Link from 'next/link'
import { ProductPreviewType } from '../types/types'

interface Props {
  product: ProductPreviewType
}

const Product = ({ product }: Props) => {
  return (
    <div className="bg-page min-h-[540px] rounded-3xl border border-black/25 px-2 py-3">
      <div
        className="rounded-3xl relative h-[404px] bg-cover bg-no-repeat"
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

        <div className="absolute bottom-4 flex-wrap flex w-full items-center justify-between px-5">
          <a
            href="#"
            className="text-color-title-on-light font-ray flex h-12 items-center justify-center gap-3 rounded-full bg-[#F2F2F2] pr-5 pl-2 font-medium whitespace-nowrap"
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
          </a>
          <a
            href="#"
            className="text-color-title-on-dark font-ray flex h-12 items-center justify-center rounded-3xl bg-black px-7 font-extrabold"
          >
            {product.price.toLocaleString('fa-IR')}
            <span className="pr-1">تومان</span>
          </a>
        </div>
      </div>
      <div className="mt-2.5 flex items-center justify-between w-full h-full rounded-3xl bg-[#F2F2F2] px-8 py-4">
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
