import Image from 'next/image'

const HealthInvestmentSection = () => {
  return (
    <div className="bg-section flex w-full flex-col items-center justify-center">
      {/* Title */}
      <h2 className="font-aria text-color-title-on-dark mb-8 mt-16 xl:mb-16 max-w-xl text-center text-4xl font-bold xl:max-w-3xl xl:text-6xl">
        سرمایه‌ای که هیچ بانکی نمی‌تواند به شما بدهد
      </h2>

      {/* Cards Wrapper */}

      <div className="container-narrow mb-16 grid grid-cols-1 gap-y-6 lg:grid-cols-[475px_1fr_1fr] lg:gap-x-8">
        {/* RIGHT COLUMN (tall card) */}
        <div className="from-accent-purple to-accent-blue flex flex-col justify-center rounded-3xl bg-linear-to-r px-6 py-5">
          {/* Icon Circle */}
          <div className="mb-6 flex">
            <div className="bg-section flex h-[45px] w-[45px] items-center justify-center rounded-full xl:h-[70px] xl:w-[70px]">
              <Image
                src="/images/spa.svg"
                alt="Healthy Lifestyle"
                width={35}
                height={35}
                className="h-[22px] w-[22px] xl:h-[35px] xl:w-[35px]"
              />
            </div>
          </div>

          <h3 className="font-aria text-color-title-on-light mb-4 text-2xl font-semibold xl:text-3xl">
            سلامتی؛ بزرگ‌ترین سرمایه‌ زندگی
          </h3>

          <div className="font-ray text-color-body-on-light text-base whitespace-pre-line">
            {`سلامتی نه یک «هزینه»، بلکه بنیادی‌ترین «سرمایه‌گذاری» زندگی است.
            وقتی بدن شما انرژی پاک دارد، ذهن شما شفاف‌تر می‌شود. وقتی تغذیه شما سالم است، تصمیم‌هایتان عمیق‌تر و اثرگذارتر خواهند بود.
        
            مطالعات اقتصادی نشان می‌دهد افرادی که سبک زندگی سالم دارند، به‌طور میانگین ۲۰٪ بهره‌وری بیشتری در کار دارند. یعنی اگر در هفته ۴۰ ساعت کار می‌کنید، یک فرد سالم معادل ۸ ساعت اضافه‌تر نتیجه می‌گیرد — بدون اینکه زمان بیشتری صرف کرده باشد.
        
            همین اختلاف کوچک در طول سال‌ها به معنای تفاوت صدها میلیون تومان درآمد بالقوه است. از طرف دیگر، هزینه‌ی بی‌توجهی به سلامتی به شکل مستقیم روی جیب شما اثر می‌گذارد. تحقیقات جهانی تخمین می‌زنند که بیماری‌های قابل پیشگیری می‌توانند تا ۱۵ تا ۲۰٪ از درآمد کل عمر یک فرد را ببلعند؛ نه فقط به‌خاطر هزینه‌های درمان، بلکه به‌خاطر روزهایی که از کار و فرصت‌های مالی عقب می‌مانید.`}
          </div>
        </div>

        {/* LEFT COLUMN (2 stacked) */}
        <div className="flex flex-col justify-between gap-6 md:col-span-2">
          {/* Top-left small card */}
          <div className="bg-section-deep flex flex-col items-center justify-center rounded-3xl">
            <h3 className="font-aria text-color-title-on-dark max-w-lg self-start p-7 text-2xl font-semibold xl:max-w-xl xl:self-center lg:p-12 xl:text-3xl">
              مطالعات نشان می‌دهد که
              <span className="text-accent-purple"> ۸۰٪</span> بیماری‌های مزمن
              با تغذیه و سبک زندگی سالم{' '}
              <span className="text-accent-purple">قابل پیشگیری</span> هستند
            </h3>
          </div>

          {/* Bottom-left small card */}
          <div className="bg-section-deep flex flex-col justify-center rounded-3xl p-7 lg:p-12">
            {/* Icon Circle */}
            <div className="mb-4 flex">
              <div className="bg-section flex h-[45px] w-[45px] items-center justify-center rounded-full xl:h-[70px] xl:w-[70px]">
                <Image
                  src="/images/vital-signs.svg"
                  alt="Healthy Lifestyle"
                  width={35}
                  height={35}
                  className="h-[25px] w-[25px] xl:h-[35px] xl:w-[35px]"
                />
              </div>
            </div>

            <h3 className="font-aria text-color-title-on-dark text-2xl xl:text-3xl font-semibold">
              حیات در دستانت
            </h3>
            <p className="font-ray text-color-body-on-dark text-col max-w-[536px]">
              تحقیقات دانشگاه هاروارد نشان داده است که انتخاب یک رژیم غذایی
              متعادل می‌تواند امید به زندگی را بین ۱۰ تا ۱۴ سال افزایش دهد. این
              تنها به معنای سال‌های بیشتر نیست، بلکه به معنای سال‌هایی با کیفیت
              بالاتر است؛ سال‌هایی که می‌توانید با انرژی، تمرکز و آزادی بیشتری
              زندگی کنید.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthInvestmentSection
