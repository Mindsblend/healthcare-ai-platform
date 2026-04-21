import Image from 'next/image'

const HealthInvestmentSection = () => {
  return (
    <div className="bg-section">
      <div className="container flex w-full flex-col items-center justify-center">
        {/* Title */}
        <h2 className="font-aria text-color-title-on-dark mt-16 mb-8 max-w-xl text-center text-4xl font-bold xl:mb-16 xl:max-w-2xl xl:text-5xl">
          سرمایه‌ای که هیچ بانکی نمی‌تواند به شما بدهد
        </h2>

        {/* Cards Wrapper */}

        <div className="mb-16 grid grid-cols-1 gap-y-6 lg:grid-cols-[475px_1fr_1fr] lg:gap-x-8">
          {/* RIGHT COLUMN (tall card) */}
          <div className="from-accent-purple to-accent-blue flex flex-col justify-center rounded-3xl bg-linear-to-r px-6 py-7 xl:px-11.25 xl:pb-8">
            {/* Icon Circle */}
            <div className="mb-3 flex">
              <div className="bg-section flex h-11.25 w-11.25 items-center justify-center rounded-full xl:h-16.25 xl:w-16.25">
                <Image
                  src="/images/spa.svg"
                  alt="Healthy Lifestyle"
                  width={25}
                  height={25}
                />
              </div>
            </div>

            <h3 className="font-aria text-color-title-on-light mb-2.5 text-2xl font-semibold xl:text-3xl">
              سلامتی؛ بزرگ‌ترین سرمایه‌ زندگی
            </h3>

            <div className="font-ray text-color-body-on-light text-sm whitespace-pre-line">
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
              <h3 className="font-aria text-color-title-on-dark max-w-lg self-start p-7 text-2xl font-semibold lg:p-12 xl:max-w-xl xl:self-center xl:text-3xl">
                مطالعات نشان می‌دهد که
                <span className="text-accent-purple"> ۸۰٪</span> بیماری‌های مزمن
                با تغذیه و سبک زندگی سالم{' '}
                <span className="text-accent-purple">قابل پیشگیری</span> هستند
              </h3>
            </div>

            {/* Bottom-left small card */}
            <div className="bg-section-deep flex flex-col justify-center rounded-3xl px-11.25 py-9.25">
              {/* Icon Circle */}
              <div className="mb-3 flex">
                <div className="bg-section flex h-11.25 w-11.25 items-center justify-center rounded-full xl:h-16.25 xl:w-16.25">
                  <Image
                    src="/images/vital-signs.svg"
                    alt="Healthy Lifestyle"
                    width={25}
                    height={25}
                  />
                </div>
              </div>

              <h3 className="font-aria text-color-title-on-dark text-2xl font-semibold xl:text-3xl">
                حیات در دستانت
              </h3>
              <p className="font-ray text-color-body-on-dark text-col mt-2.5 max-w-134">
                تحقیقات دانشگاه هاروارد نشان داده است که انتخاب یک رژیم غذایی
                متعادل می‌تواند امید به زندگی را بین ۱۰ تا ۱۴ سال افزایش دهد.
                این تنها به معنای سال‌های بیشتر نیست، بلکه به معنای سال‌هایی با
                کیفیت بالاتر است؛ سال‌هایی که می‌توانید با انرژی، تمرکز و آزادی
                بیشتری زندگی کنید.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthInvestmentSection
