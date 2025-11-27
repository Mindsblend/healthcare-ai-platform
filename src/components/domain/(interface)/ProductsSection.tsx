import Product from '@/components/layout/Product'

const ProductsSection = () => {
  return (
    <div className="mt-60 flex items-center justify-center flex-col">
      <div className="text-color-title-on-light flex flex-col items-center justify-center text-center">
        <h1 className="font-aria text-xl font-bold">انتخابی سالم</h1>
        <h1 className="font-aria mt-3 max-w-5xl text-5xl font-bold">
          محصولات ارگانیکی که بدن شما را تغذیه و آینده شما را بیمه می‌کنند
        </h1>
      </div>
      <div className='grid grid-cols-1 px-5 md:grid-cols-2 xl:grid-cols-3 gap-6'>
        <Product />
        <Product />
        <Product />
      </div>
    </div>
  )
}

export default ProductsSection
