const FeaturesSection = () => {
  const items = [
    {
      title: 'انرژی ماندگار، به‌طور طبیعی',
      description:
        'دیگر خبری از افت قند یا خستگی ناگهانی نیست. با غذاهای ارگانیک، سوخت بدن آرام و یکنواخت تأمین می‌شود؛ برای تمرکز بیشتر و نشاط روزانه.',
      icon: '/images/eco.svg',
    },
    {
      title: 'طعم واقعی، زندگی واقعی',
      description:
        'غذای طبیعی طعم زنده‌ای دارد. از سبزیجات تازه تا غلات غنی، ارگانیک همان طعمی است که بدن شما می‌شناسد و نیاز دارد.',
      icon: '/images/spoon.svg',
    },
    {
      title: 'بدنی سبک‌تر، ذهنی روشن‌تر',
      description:
        'غذاهای ارگانیک با حذف سموم و افزودنی‌ها به بدن اجازه می‌دهند سبک‌تر کار کند؛ نتیجه‌اش تمرکز بیشتر و ذهن آرام‌تر است..',
      icon: '/images/accessibility.svg',
    },
    {
      title: 'ایمنی طبیعی بدن',
      description:
        'دیگر خبری از افت قند یا خستگی ناگهانی نیست. با غذاهای ارگانیک، سوخت بدن آرام و یکنواخت تأمین می‌شود؛ برای تمرکز بیشتر و نشاط روزانه..',
      icon: '/images/encryption.svg',
    },
    {
      title: 'زندگی بدون استرس غذایی',
      description:
        'با ارگانیک بودن، دیگر لازم نیست نگران برچسب‌های شیمیایی و افزودنی‌های پنهان باشید. غذایتان شفاف و قابل‌اعتماد است..',
      icon: '/images/frustrated.svg',
    },
    {
      title: 'میراث سلامتی برای خانواده',
      description:
        'انتخاب ارگانیک امروز، یعنی هدیه‌دادن آینده‌ای سالم‌تر به فرزندان؛ با عادت‌های درست، بدنی پاک‌تر و محیطی سبزتر.',
      icon: '/images/diversity.svg',
    },
  ]

  return (
    <div className="flex w-full gap-16 px-20 py-32">
      {/* Right side (sticky title + paragraph) */}
      <div className="sticky top-24 h-fit w-1/2">
        <h2 className="font-aria text-color-title-on-light mb-4 text-[40px] leading-tight font-extrabold">
          با هر محصول، یک قدم به زندگی دلخواهت نزدیک‌تر شو
        </h2>
        <p className="font-ray text-color-body-on-light max-w-[508px] text-lg">
          تصور کن صبح را با انرژی و ذهنی شفاف شروع می‌کنی. غذایی که می‌خوری نه
          پر از افزودنی ناشناخته، بلکه سرشار از مواد مغذی و طبیعی است. خیالت
          راحت است که بدن و خانواده‌ات را از بیماری‌های آینده محافظت کرده‌ای.
        </p>
      </div>

      {/* Left side (scrolling items) */}
      <div className="flex w-1/2 flex-col gap-10">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-4 pb-6 text-right"
            dir="rtl"
          >
            {/* Icon */}
            <img src={item.icon} alt="" className="h-15 w-15 object-contain" />

            {/* Text */}
            <div>
              <h3 className="font-aria mb-1 text-[30px] font-extrabold">
                {item.title}
              </h3>
              <p className="font-ray max-w-[368px] text-[18px] text-gray-600">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FeaturesSection
