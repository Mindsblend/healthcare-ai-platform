import {
  fetchAllProducts,
  fetchProductBySlug,
} from '@/features/shop/services/fetchProducts'
import Image from 'next/image'
import Questions from '@/components/ui/Qustions'

export async function generateStaticParams() {
  const products = await fetchAllProducts()

  return products
    .filter((product) => product.slug)
    .map((product) => ({
      slug: product.slug!,
    }))
}

export default async function ProductPage(props: { params: any }) {
  // unwrap the promise
  const { slug: rawSlug } = await props.params
  const slug = decodeURIComponent(rawSlug)

  if (!slug) return <div>محصول پیدا نشد</div>

  let product
  try {
    product = await fetchProductBySlug(slug)
  } catch (e) {
    return <div>محصول پیدا نشد</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between px-18 2xl:px-56">
        <div>
          <h1 className="font-aria text-color-title-on-light text-4xl font-extrabold">
            {product.title}
          </h1>
          <div className="mt-5 flex items-center gap-3">
            <div className="flex gap-1">
              <Image
                src="/images/earbuds.svg"
                alt="earbuds icon"
                width={13}
                height={13}
              />
              <h1 className="font-ray text-color-title-on-light text-base font-medium">
                بدون وابستگی مصرف
              </h1>
            </div>
            <div className="flex gap-1">
              <Image
                src="/images/routine.svg"
                alt="routine icon"
                width={20}
                height={20}
              />
              <h1 className="font-ray text-color-title-on-light text-base font-medium">
                مناسب برای استفاده روزانه
              </h1>
            </div>
            <div className="flex gap-1">
              <Image
                src="/images/more_time.svg"
                alt="more time icon"
                width={18}
                height={18}
              />
              <h1 className="font-ray text-color-title-on-light text-base font-medium">
                اثر تجمعی ملایم
              </h1>
            </div>
          </div>
          {/* static description! */}
          <p className="font-ray text-color-body-on-light mt-5 max-w-xl text-lg">
            کرم ویتال‌درم با تمرکز بر بازسازی سد دفاعی پوست و تأمین رطوبت پایدار
            طراحی شده است. با ترکیبی از عصاره‌های گیاهی فعال، ویتامین‌های ضروری
            و عوامل آبرسان عمقی، به پوست کمک می‌کند تعادل طبیعی خود را بازیابد و
            در برابر خشکی، تحریک‌پذیری و عوامل محیطی مقاوم‌تر
          </p>
          <div className="bg-section mt-5 rounded-lg px-6 py-[23px]">
            <div className="flex items-center gap-1.5">
              <Image
                src="/images/cognition.svg"
                alt="cognition icon"
                width={20}
                height={20}
              />
              <h1 className="font-aria text-color-title-on-dark text-sm font-semibold">
                هوش مصنوعی
              </h1>
            </div>
            <p className="font-ray text-color-title-on-dark mt-2.5 max-w-[525px] text-sm font-medium">
              اشکان عزیز، بر اساس اطلاعاتی که ارائه کرده‌ای و وضعیت پوستت، این
              کرم آبرسان دقیقاً همان محصولی است که برای حل مشکل خشکی و کم‌آبی
              پوست- نیاز داری. ترکیبات گیاهی فعال و ویتامین‌های موجود در این
              محصول، به بهبود سد دفاعی پوست و افزایش رطوبت سلولی کمک می‌کنند.
              مطالعات نشان داده‌اند که مصرف منظم چنین ترکیبی باعث کاهش
              التهاب‌های سطحی و افزایش انعطاف‌پذیری پوست می‌شود، که دقیقاً همان
              چیزی است که برای نوع پوست تو توصیه می‌شود.
            </p>
          </div>
          <div className="mt-7 flex flex-col gap-5">
            <div className="flex cursor-pointer items-center gap-1.5">
              <Image
                src="/images/add_circle.svg"
                alt="add circle icon"
                width={19.5}
                height={19.5}
              />
              <h1 className="font-ray text-color-title-on-light text-base font-medium">
                <span className="font-extrabold">حفظ رطوبت پوست: </span>اسید
                هیالورونیک — قادر به حفظ رطوبت پوست
              </h1>
            </div>
            <div className="flex cursor-pointer items-center gap-1.5">
              <Image
                src="/images/add_circle.svg"
                alt="add circle icon"
                width={19.5}
                height={19.5}
              />
              <h1 className="font-ray text-color-title-on-light text-base font-medium">
                <span className="font-extrabold">افزایش کلاژن: </span>ویتامین C
                — تحریک تولید کلاژن در پوست
              </h1>
            </div>
            <div className="flex cursor-pointer items-center gap-1.5">
              <Image
                src="/images/add_circle.svg"
                alt="add circle icon"
                width={19.5}
                height={19.5}
              />
              <h1 className="font-ray text-color-title-on-light text-base font-medium">
                <span className="font-extrabold">ضد التهاب: </span>نیاسینامید —
                قرمزی و تحریک پوست را کاهش می‌دهد
              </h1>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-4">
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
        <div className="bg-page h-[631px] w-[632px] rounded-3xl border border-black/25 px-2 py-3">
          <div
            className="relative h-full w-full rounded-3xl bg-cover bg-no-repeat"
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
          </div>
        </div>
      </div>
      <Questions product={product} />
    </div>
  )
}
