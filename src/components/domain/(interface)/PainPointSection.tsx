import Image from 'next/image'

const PainPointSection = () => {
  return (
    <div className="w-full space-y-12 md:space-y-20 lg:space-y-32">
      {/* Section 1: Image Left, Text Right */}
      <div className="container mx-auto flex flex-col px-4 md:px-6 lg:flex-row lg:items-center lg:gap-12 lg:px-8 xl:gap-20">
        {/* Image Section - Left */}
        <div className="mb-8 w-full lg:mb-0 lg:w-5/12">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl lg:aspect-4/3 lg:rounded-3xl">
            <Image
              src="/images/pain-point-one.webp"
              alt="Section 1 Image"
              fill
              className="object-contain transition-transform duration-500 hover:scale-105"
              priority
            />
          </div>
        </div>

        {/* Text Section - Right */}
        <div className="w-full text-center lg:w-7/12 lg:text-right">
          <div className="lg:max-w-[90%] xl:max-w-[85%]">
            <h2 className="font-aria text-color-title-on-light mb-4 text-[22px] font-bold sm:text-[22px] md:mb-6 lg:text-[32px]">
              پایه و سرمایه‌ای که کیفیت لحظه‌های زندگی با عزیزانت را تعیین
              می‌کند
            </h2>
            <p className="font-ray text-color-body-on-light mb-6 text-sm leading-relaxed sm:text-base md:mb-8 md:text-lg">
              زمانی که سلامتی هست، زندگی معنای دیگری دارد. بخش بزرگی از این معنا
              در لحظات کوچک و واقعی است که در آن حاضر میشویم: صدای خنده‌ی
              فرزندانمان، گفتگوی صمیمانه با همسر، لمس ساده‌ی صبحی آرام که پر از
              امید است. این‌ها سرمایه‌هایی‌اند که ارزششان با هیچ عددی سنجیده
              نمی‌شود.اما وقتی سلامتی‌ات را نادیده می‌گیری، سایه‌ای سنگین بر
              همه‌ی این لحظات می‌افتد. انرژی‌ات ته می‌کشد، دردهای پنهان
              آرام‌آرام آشکار می‌شوند، و خستگی مداوم تو را از شادی‌های کوچک دور
              می‌کند. آن‌وقت حتی ساده‌ترین لحظات با عزیزانت، دست‌نیافتنی
              می‌شوند.سرمایه‌گذاری روی بدن و ذهن امروزت یعنی ساختن آینده‌ای که
              در آن می‌توانی حاضر و پرانرژی کنار کسانی باشی که دوستشان داری. هر
              روز غفلت، یک خاطره‌ی ناب را از تو و خانواده‌ات می‌گیرد.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Image Right, Text Left */}
      <div className="container mx-auto flex flex-col px-4 md:px-6 lg:flex-row-reverse lg:items-center lg:gap-12 lg:px-8 xl:gap-20">
        {/* Image Section - Right */}
        <div className="mb-8 w-full lg:mb-0 lg:w-5/12">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl lg:aspect-4/3 lg:rounded-3xl">
            <Image
              src="/images/pain-point-two.webp"
              alt="Section 2 Image"
              fill
              className="object-contain transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* Text Section - Left */}
        <div className="w-full text-center lg:w-7/12 lg:text-right">
          <div className="lg:max-w-[90%] xl:max-w-[85%]">
            <h2 className="font-aria text-color-title-on-light mb-4 text-[22px] font-bold sm:text-[22px] md:mb-6 lg:text-[32px]">
              سرنوشتت پیری نیست، بلکه نتیجه‌ی انتخاب‌هایی است که امروز میگیری
            </h2>
            <p className="font-ray text-color-body-on-light mb-6 text-sm leading-relaxed sm:text-base md:mb-8 md:text-lg">
              شاید همیشه دیده‌ایم که پدر و مادر یا اطرافیان‌مان با بالا رفتن سن،
              آرام‌آرام توانایی‌هایشان را از دست داده‌اند؛ دردهای مزمن، انرژی
              کم، وابستگی به دارو و از دست رفتن آزادی عمل. ناخودآگاه باور
              کرده‌ایم که این سرنوشت ما هم خواهد بود. اما این فقط یک توهم است.
              سلامتی آینده تو، حاصل تصمیم‌های امروز توست. اگر از همین حالا برای
              مراقبت از بدن و ذهن خود سرمایه‌گذاری کنی، می‌توانی سال‌های پیری را
              نه با بیماری و محدودیت، بلکه با انرژی، آزادی و حضور واقعی در کنار
              کسانی که دوستشان داری تجربه کنی. انتخاب با توست: تکرار چرخه‌ای که
              دیده‌ای، یا ساختن آینده‌ای که شایسته‌اش هستی.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PainPointSection
