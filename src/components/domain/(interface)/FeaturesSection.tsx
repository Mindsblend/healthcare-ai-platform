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
    <div className="container flex w-full justify-between gap-5 py-12 max-sm:flex-col max-sm:items-center xl:gap-16">
      {/* Right side (sticky title + paragraph) */}
      <div className="top-24 h-fit max-sm:mb-10 max-sm:max-w-xs max-sm:text-center sm:sticky sm:w-1/2">
        <h2 className="font-aria text-color-title-on-light mb-4 text-3xl font-extrabold max-sm:font-bold xl:text-5xl">
          با هر محصول، یک قدم به زندگی دلخواهت نزدیک‌تر شو
        </h2>
        <p className="font-ray text-color-body-on-light max-w-127 text-sm sm:text-base xl:text-lg">
          تصور کن صبح را با انرژی و ذهنی شفاف شروع می‌کنی. غذایی که می‌خوری نه
          پر از افزودنی ناشناخته، بلکه سرشار از مواد مغذی و طبیعی است. خیالت
          راحت است که بدن و خانواده‌ات را از بیماری‌های آینده محافظت کرده‌ای.
        </p>
      </div>

      {/* Left side (scrolling items) */}
      <div className="flex flex-col gap-10 max-lg:max-w-xs">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 pb-6 sm:gap-4">
            {/* Icon */}
            <img
              src={item.icon}
              alt="items icons"
              className="h-10 w-10 object-contain xl:h-17.5 xl:w-17.5"
            />

            {/* Text */}
            <div>
              <h3 className="font-aria text-color-title-on-light mb-1 text-2xl font-extrabold xl:text-3xl">
                {item.title}
              </h3>
              <p className="font-ray max-w-92 text-sm text-gray-600 sm:text-base xl:text-lg">
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
