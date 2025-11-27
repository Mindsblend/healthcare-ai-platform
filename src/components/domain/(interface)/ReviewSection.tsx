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
    name: 'مرجان رضایی',
    content:
      'از وقتی محصولات شما رو استفاده می‌کنم، انرژی بدنم دو برابر شده. کاملاً حس می‌کنم که روی آینده‌م سرمایه‌گذاری کردم.',
    imagePath: '/images/reviews/marjan.png',
  },
  {
    id: 2,
    name: 'سینا مرادی',
    content:
      'تست هوش مصنوعی فوق‌العاده بود. دقیق، سریع و کاملاً کاربردی. بهترین تجربه‌ای بود که از یک برند سلامت داشتم.',
    imagePath: '/images/reviews/sina.png',
  },
  {
    id: 3,
    name: 'هستی فرهمند',
    content:
      'بسته‌بندی، کیفیت محصول و حس اصالت… همه چیز درجه یک. حس می‌کنم واقعاً برای جامعه‌ی سالم‌تر تلاش می‌کنید.',
    imagePath: '/images/reviews/hasti.png',
  },
  {
    id: 4,
    name: 'پارسا امیری',
    content:
      'اینکه یک برند انقدر روی تجربه مشتری تمرکز کنه کم‌نظیره. تست هوشمند به من کمک کرد رژیمم رو اصلاح کنم.',
    imagePath: '/images/reviews/parsa.png',
  },
  {
    id: 5,
    name: 'الهام کیان',
    content:
      'من همیشه دنبال محصولات ارگانیک واقعی بودم. این اولین برندی هست که حس می‌کنم واقعاً قابل اعتماده.',
    imagePath: '/images/reviews/elham.png',
  },
]

const ReviewSection = () => {
  return (
    <section className="flex w-full flex-col items-center justify-center px-6 py-20">
      {/* Title */}
      <h2 className="font-aria text-color-title-on-light mb-4 max-w-xl text-center text-[40px] leading-12 font-extrabold">
        صدای کسانی که سلامتی و زندگی خود را متحول کردند
      </h2>
      <p className="font-ray text-color-body-on-light mb-16 max-w-xl text-center text-[22px] leading-6">
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
            className="flex items-start gap-4 rounded-2xl border border-black/10 bg-white p-6 shadow-lg"
          >
            {/* Circle Image */}
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gray-100">
              <Image
                src={`/images/icon-${review.id}.svg`}
                alt="icon"
                width={40}
                height={40}
              />
            </div>

            {/* Text */}
            <div className="flex flex-col">
              <div className="flex w-full items-center justify-between">
                <h3 className="text-xl font-semibold">{review.name}</h3>
                <Image
                  src="/images/star.svg"
                  alt="icon"
                  width={20}
                  height={20}
                />
              </div>
              <p className="mt-1 text-sm text-gray-600">
                {review.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Row (2 Cards) */}
      <div className="mt-10 grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
        {reviews.slice(3, 5).map((review) => (
          <div
            key={review.id}
            className="flex items-start gap-4 rounded-2xl border border-black/10 bg-white p-6 shadow-lg"
          >
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gray-100">
              <Image
                src={`/images/icon-${review.id}.svg`}
                alt="icon"
                width={40}
                height={40}
              />
            </div>

            <div className="flex flex-col">
              <div className="flex w-full items-center justify-between">
                <h3 className="text-xl font-semibold">{review.name}</h3>
                <Image
                  src="/images/star.svg"
                  alt="icon"
                  width={20}
                  height={20}
                />
              </div>
              <p className="mt-1 text-sm text-gray-600">
                {review.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ReviewSection
