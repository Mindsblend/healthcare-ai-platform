import ProductSwiper from '@/components/layout/ProductSwiper'
import { ProductType } from '@/components/types/types'

interface Props {
  products: ProductType[]
}

const ProductsSection = ({ products }: Props) => {
  return (
    <div className="mt-48 flex w-full flex-col">
      {/* only this block is centered */}
      <div className="text-color-title-on-light flex flex-col items-center text-center">
        <h1 className="font-aria text-xl font-bold">انتخابی سالم</h1>
        <h1 className="font-aria mt-3 max-w-5xl text-5xl font-bold">
          محصولات ارگانیکی که بدن شما را تغذیه و آینده شما را بیمه می‌کنند
        </h1>
      </div>

      {/* slider below, full width */}
      <div className="flex items-center justify-center">
        <ProductSwiper products={products} />
      </div>
    </div>
  )
}

export default ProductsSection
