import Image from 'next/image'

const HealthInvestmentSection = () => {
  return (
    <div className="bg-section flex w-full flex-col items-center justify-center">
      {/* Title */}
      <h2 className="font-aria text-color-title-on-dark mt-16 mb-16 max-w-3xl text-center text-6xl font-bold">
        سرمایه‌ای که هیچ بانکی نمی‌تواند به شما بدهد
      </h2>

      {/* Cards Wrapper */}

      <div className="mb-16 grid w-full max-w-[1200px] grid-cols-1 lg:grid-cols-[475px_1fr_1fr] gap-8 px-8">
        {/* RIGHT COLUMN (tall card) */}
        <div className="from-accent-purple to-accent-blue flex flex-col justify-center rounded-3xl bg-linear-to-r p-6">
          {/* Icon Circle */}
          <div className="mb-6 flex">
            <div className="bg-section flex h-[70px] w-[70px] items-center justify-center rounded-full">
              <Image
                src="/images/spa.svg"
                alt="Healthy Lifestyle"
                width={35}
                height={35}
              />
            </div>
          </div>

          <h3 className="font-aria text-color-title-on-light mb-4 text-3xl font-semibold">
            سلامتی؛ بزرگ‌ترین سرمایه‌ زندگی
          </h3>

          <div className="font-ray text-color-body-on-light max-w-[600px] text-base whitespace-pre-line">
            {`سلامتی نه یک «هزینه»، بلکه بنیادی‌ترین «سرمایه‌گذاری» زندگی است.
            وقتی بدن شما انرژی پاک دارد، ذهن شما شفاف‌تر می‌شود. وقتی تغذیه شما سالم است، تصمیم‌هایتان عمیق‌تر و اثرگذارتر خواهند بود.
        
            مطالعات اقتصادی نشان می‌دهد افرادی که سبک زندگی سالم دارند، به‌طور میانگین ۲۰٪ بهره‌وری بیشتری در کار دارند. یعنی اگر در هفته ۴۰ ساعت کار می‌کنید، یک فرد سالم معادل ۸ ساعت اضافه‌تر نتیجه می‌گیرد — بدون اینکه زمان بیشتری صرف کرده باشد.
        
            همین اختلاف کوچک در طول سال‌ها به معنای تفاوت صدها میلیون تومان درآمد بالقوه است. از طرف دیگر، هزینه‌ی بی‌توجهی به سلامتی به شکل مستقیم روی جیب شما اثر می‌گذارد. تحقیقات جهانی تخمین می‌زنند که بیماری‌های قابل پیشگیری می‌توانند تا ۱۵ تا ۲۰٪ از درآمد کل عمر یک فرد را ببلعند؛ نه فقط به‌خاطر هزینه‌های درمان، بلکه به‌خاطر روزهایی که از کار و فرصت‌های مالی عقب می‌مانید.`}
          </div>
        </div>

        {/* LEFT COLUMN (2 stacked) */}
        <div className="flex flex-col gap-6 md:col-span-2">
          {/* Top-left small card */}
          <div className="bg-section-deep flex flex-col items-center justify-center rounded-3xl">
            <h3 className="font-aria text-color-title-on-dark max-w-2xl lg:max-w-xl self-start lg:self-center p-12 lg:px-5 text-[30px] font-semibold">
              مطالعات نشان می‌دهد که
              <span className="text-accent-purple"> ۸۰٪</span> بیماری‌های مزمن
              با تغذیه و سبک زندگی سالم{' '}
              <span className="text-accent-purple">قابل پیشگیری</span> هستند
            </h3>
          </div>

          {/* Bottom-left small card */}
          <div className="bg-section-deep flex flex-col justify-center rounded-3xl p-12">
            {/* Icon Circle */}
            <div className="mb-4 flex">
              <div className="bg-section flex h-[70px] w-[70px] items-center justify-center rounded-full">
                <Image
                  src="/images/vital-signs.svg"
                  alt="Healthy Lifestyle"
                  width={35}
                  height={35}
                />
              </div>
            </div>

            <h3 className="font-aria text-color-title-on-dark text-3xl font-semibold">
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
