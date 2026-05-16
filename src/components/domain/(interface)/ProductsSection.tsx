import { ProductService } from '@/features/shop/services/ProductService'
import ProductSwiper from '@/components/layout/ProductSwiper'

export default async function ProductsSection() {
  const products = await ProductService.fetchProductsPreview()

  return (
    <div className="container mt-24 mb-12 flex w-full flex-col">
      {/* only this block is centered */}
      <div className="text-color-title-on-light flex flex-col items-center text-center">
        <h1 className="font-aria text-xl font-bold">انتخابی سالم</h1>
        <h1 className="font-aria text-color-title-on-light mt-3 mb-4 max-w-3xl text-center text-2xl font-bold sm:text-4xl xl:max-w-4xl xl:text-5xl">
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
