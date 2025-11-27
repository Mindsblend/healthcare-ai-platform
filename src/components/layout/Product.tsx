import Image from 'next/image'
import Link from 'next/link'

const Product = () => {
  return (
    <div className="bg-page h-[540px] w-[415px] rounded-3xl border border-black/25 px-2 py-3">
      <div
        className="relative h-[405px]"
        style={{ backgroundImage: `url(/images/productImage.png)` }}
      >
        <div className="bg-page absolute top-3.5 right-4 z-10 h-12 w-12 rounded-full p-2.5">
          <Image
            src="/images/makeup.png"
            alt="Product icon"
            width={30}
            height={30}
          />
        </div>

        <div className="absolute bottom-4 flex items-center justify-between px-5">
          <a
            href="#"
            className="bg-color-title-on-light font-ray inline-block rounded-3xl px-7 py-2.5 font-medium"
          >
            افزودن
          </a>
          <a href="#">افزودن</a>
        </div>
      </div>
      <div className="mt-2.5 flex items-center justify-between rounded-3xl bg-[#F2F2F2] px-8 py-4">
        <div className="text-color-title-on-light">
          <h1 className="font-ray text-2xl font-extrabold">کرم آبرسان</h1>
          <p className="font-ray mt-0.5 max-w-[200px] text-sm font-medium">
            کرم‌ها می‌تونن مواد مفیدی مثل ویتامین‌، یا عصاره‌ گیاهی داشته باشن
          </p>
        </div>
        <Link
          href=""
          className="text-color-title-on-light font-ray inline-block font-black decoration-black"
        >
          مشاهده محصول
        </Link>
      </div>
    </div>
  )
}

export default Product
