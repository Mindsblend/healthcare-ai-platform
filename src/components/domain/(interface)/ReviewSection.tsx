import Image from 'next/image'

interface Review {
  id: number
  name: string
  content: string
  imagePath: string
}

const reviews: Review[] = [
  {
    id: 1,
    name: 'سارا رضایی',
    content:
      'از وقتی محصولات شما رو استفاده می‌کنم، انرژی بدنم دو برابر شده. کاملاً حس می‌کنم که روی آینده‌م سرمایه‌گذاری کردم.',
    imagePath: '/images/sara.svg',
  },
  {
    id: 2,
    name: 'آرش مرادی',
    content:
      'تست هوش مصنوعی فوق‌العاده بود. دقیق، سریع و کاملاً کاربردی. بهترین تجربه‌ای بود که از یک برند سلامت داشتم.',
    imagePath: '/images/arash.svg',
  },
  {
    id: 3,
    name: 'نازنین فرهمند',
    content:
      'بسته‌بندی، کیفیت محصول و حس اصالت… همه چیز درجه یک. حس می‌کنم واقعاً برای جامعه‌ی سالم‌تر تلاش می‌کنید.',
    imagePath: '/images/nazanin.svg',
  },
  {
    id: 4,
    name: 'فریبرز امیری',
    content:
      'اینکه یک برند انقدر روی تجربه مشتری تمرکز کنه کم‌نظیره. تست هوشمند به من کمک کرد رژیمم رو اصلاح کنم.',
    imagePath: '/images/fariborz.svg',
  },
  {
    id: 5,
    name: 'امیر کیان',
    content:
      'من همیشه دنبال محصولات ارگانیک واقعی بودم. این اولین برندی هست که حس می‌کنم واقعاً قابل اعتماده.',
    imagePath: '/images/amir.svg',
  },
]

const ReviewSection = () => {
  return (
    <section className="container flex w-full flex-col items-center justify-center py-12">
      {/* Title */}
      <h2 className="font-aria text-color-title-on-light mb-4 max-w-lg text-center text-3xl font-extrabold sm:text-4xl xl:max-w-2xl xl:text-5xl">
        صدای کسانی که سلامتی و زندگی خود را متحول کردند
      </h2>
      <p className="font-ray text-color-body-on-light mb-16 max-w-lg text-center text-xs font-medium max-sm:max-w-sm sm:text-base xl:text-lg">
        هر تجربه‌ای، داستانی از تغییر و انتخاب درست است. کاربران ما با محصولات و
        راهنمایی‌های شخصی، نه تنها سلامتی خود را بهبود داده‌اند، بلکه سبک زندگی
        و کیفیت روزمره خود را نیز متحول کرده‌اند.
      </p>

      {/* Cards Grid */}
      <div className="grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
        {/* Top Row (3 Cards) */}
        {reviews.slice(0, 3).map((review) => (
          <div
            key={review.id}
            className="flex items-center gap-4 rounded-2xl border border-black/10 bg-white p-6 shadow-lg"
          >
            {/* Text */}
            <div className="flex flex-col">
              <span className="xl:pl-6">
                <Image
                  src="/images/quote.svg"
                  alt="icon"
                  width={20}
                  height={20}
                />
              </span>
              <p className="font-ray text-color-body-on-light mt-1 py-1.25 text-xs xl:text-sm">
                {review.content}
              </p>
              <div className="flex w-full items-center justify-between">
                <h3 className="font-aria text-color-title-on-light text-base font-semibold xl:text-xl">
                  {review.name}
                </h3>
              </div>
            </div>
            {/* Circle Image */}
            <div className="flex w-42 items-center justify-center overflow-hidden rounded-full bg-gray-100">
              <Image src={review.imagePath} alt="icon" width={72} height={72} />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Row (2 Cards) */}
      <div className="mt-10 grid w-full max-w-3xl grid-cols-1 gap-8 md:grid-cols-2">
        {reviews.slice(3, 5).map((review) => (
          <div
            key={review.id}
            className="flex items-center gap-4 rounded-2xl border border-black/10 bg-white p-6 shadow-lg"
          >
            <div className="flex flex-col">
              <span className="pl-6">
                <Image
                  src="/images/quote.svg"
                  alt="icon"
                  width={20}
                  height={20}
                />
              </span>
              <p className="font-ray text-color-body-on-light mt-1 py-1.25 text-xs xl:text-sm">
                {review.content}
              </p>
              <div className="flex w-full items-center justify-between">
                <h3 className="font-aria text-color-title-on-light text-base font-semibold xl:text-xl">
                  {review.name}
                </h3>
              </div>
            </div>
            <div className="flex w-42 items-center justify-center overflow-hidden rounded-full bg-gray-100">
              <Image src={review.imagePath} alt="icon" width={72} height={72} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ReviewSection
