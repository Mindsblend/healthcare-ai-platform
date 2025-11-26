import Image from 'next/image'

const HealthInvestmentSection = () => {
  return (
    <div className="w-full flex flex-col items-center bg-[#161A1D]">
      {/* Title */}
      <h2 className="font-aria font-bold text-[50px] text-white text-center mt-16 mb-16 max-w-[730px] leading-[65px]">
        سرمایه‌ای که هیچ بانکی نمی‌تواند به شما بدهد
      </h2>

      {/* Cards Wrapper */}

      <div className="w-full max-w-[1200px] mx-auto grid grid-cols-[1fr_1fr_475px] gap-8 mb-16 px-8">
        {/* RIGHT COLUMN (tall card) */}
        <div className="bg-linear-to-r from-[#B1C8FF] to-[#B4E4FF] rounded-3xl w-[475px] h-[497px] p-6 flex flex-col justify-center">
          {/* Icon Circle */}
          <div className="flex mb-6">
            <div className="w-[70px] h-[70px] rounded-full bg-[#23282D] flex items-center justify-center">
              <Image src="/images/spa.svg" alt="Healthy Lifestyle" width={35} height={35} />
            </div>
          </div>

          <h3 className="font-aria text-black text-[30px] font-semibold mb-4 leading-[20px]">
            سلامتی؛ بزرگ‌ترین سرمایه‌ زندگی
          </h3>

          <div className="font-ray text-[16px] text-[#6A7073] leading-[20px] whitespace-pre-line max-w-[600px]">
            {`سلامتی نه یک «هزینه»، بلکه بنیادی‌ترین «سرمایه‌گذاری» زندگی است.
            وقتی بدن شما انرژی پاک دارد، ذهن شما شفاف‌تر می‌شود. وقتی تغذیه شما سالم است، تصمیم‌هایتان عمیق‌تر و اثرگذارتر خواهند بود.
        
            مطالعات اقتصادی نشان می‌دهد افرادی که سبک زندگی سالم دارند، به‌طور میانگین ۲۰٪ بهره‌وری بیشتری در کار دارند. یعنی اگر در هفته ۴۰ ساعت کار می‌کنید، یک فرد سالم معادل ۸ ساعت اضافه‌تر نتیجه می‌گیرد — بدون اینکه زمان بیشتری صرف کرده باشد.
        
            همین اختلاف کوچک در طول سال‌ها به معنای تفاوت صدها میلیون تومان درآمد بالقوه است. از طرف دیگر، هزینه‌ی بی‌توجهی به سلامتی به شکل مستقیم روی جیب شما اثر می‌گذارد. تحقیقات جهانی تخمین می‌زنند که بیماری‌های قابل پیشگیری می‌توانند تا ۱۵ تا ۲۰٪ از درآمد کل عمر یک فرد را ببلعند؛ نه فقط به‌خاطر هزینه‌های درمان، بلکه به‌خاطر روزهایی که از کار و فرصت‌های مالی عقب می‌مانید.`}
          </div>
        </div>

        {/* LEFT COLUMN (2 stacked) */}
        <div className="flex flex-col gap-6 md:col-span-2">
          {/* Top-left small card */}
          <div className="bg-[#1B2024] rounded-3xl h-[199px] flex flex-col justify-center items-center">
            <h3 className="font-aria text-[30px] font-semibold text-white max-w-[493px]">
              مطالعات نشان می‌دهد که
              <span className="text-[#B1C8FF]">۸۰٪</span> بیماری‌های مزمن با تغذیه و سبک زندگی سالم{' '}
              <span className="text-[#B1C8FF]">قابل پیشگیری</span> هستند
            </h3>
          </div>

          {/* Bottom-left small card */}
          <div className="bg-[#1B2024] rounded-3xl h-[270px] p-12 flex flex-col justify-center">
            {/* Icon Circle */}
            <div className="flex mb-4">
              <div className="w-[70px] h-[70px] rounded-full bg-[#23282D] flex items-center justify-center">
                <Image
                  src="/images/vital-signs.svg"
                  alt="Healthy Lifestyle"
                  width={35}
                  height={35}
                />
              </div>
            </div>

            <h3 className="font-aria text-[30px] text-white font-semibold leading-[45px]">
              حیات در دستانت
            </h3>
            <p className="font-ray text-base text-[#6A7073] leading-[22px] max-w-[536px]">
              تحقیقات دانشگاه هاروارد نشان داده است که انتخاب یک رژیم غذایی متعادل می‌تواند امید به
              زندگی را بین ۱۰ تا ۱۴ سال افزایش دهد. این تنها به معنای سال‌های بیشتر نیست، بلکه به
              معنای سال‌هایی با کیفیت بالاتر است؛ سال‌هایی که می‌توانید با انرژی، تمرکز و آزادی
              بیشتری زندگی کنید.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthInvestmentSection
