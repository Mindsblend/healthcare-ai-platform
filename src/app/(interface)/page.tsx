import Image from 'next/image'

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Left: Image */}
        <div className="md:w-1/2 flex justify-start items-center pl-8">
          <Image
            src="/images/hero.svg"
            alt="Healthy Lifestyle"
            width={660}
            height={100}
          />
        </div>

        {/* Right: Text + Buttons */}
        <div className="md:w-1/2 flex flex-col justify-center items-end text-right mt-12 pr-24">
          <h1 className="font-aria font-extrabold text-[64px] text-black leading-[85px] max-w-[473px]">
            سلامتی امروز، پلی به فردایی شادتر
          </h1>
          <p className="font-ray font-medium text-[18px] leading-[24px] text-black max-w-[463px]">
            سلامتی چیزی نیست که بتوان آن را به فردا موکول کرد. هر تصمیم کوچک امروز، یا پلی به سوی تمرکز، انرژی و عمری طولانی‌تر است —یا قدمی خاموش به سوی آینده‌ای پر از خستگی و محدودیت. ما اینجا هستیم تا با یک تست سادهٔ هوش مصنوعی و انتخاب محصولات سالم، راهی عملی برای تغییر واقعی پیش روی شما بگذاریم.
          </p>

          <div className="flex justify-end gap-4 mt-5 mb-6">
            <button className="flex items-center justify-center w-[145px] h-[54px] border border-black rounded-full text-black font-ray font-medium text-[16px] hover:bg-black hover:text-white transition whitespace-nowrap px-0">
              آشنایی با محصولات
            </button>
            <button className="w-[210px] h-[54px] bg-black text-white rounded-full flex items-center px-4 gap-4">
              {/* Circle with icon */}
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Image
                  src="/images/arrow.svg"
                  alt="Top Right Image"
                  width={20}
                  height={20}
                />
              </div>

              {/* Button text */}
              <span className="font-aria font-medium text-[16px]">شروع سفر سلامتی</span>
            </button>
          </div>
          <div className="w-full flex flex-col justify-between items-end mb-6">
            {/* Top: Image */}
            <Image
              src="/images/mini-products.svg"
              alt="Top Right Image"
              width={140}
              height={50}
            />

            {/* Bottom: Paragraph */}
            <p className="text-black font-ray font-medium text-[16px] text-right max-w-xs transition whitespace-nowrap">
              هر محصول ما، یک قدم به سوی آینده‌ای سالم‌تر
            </p>
          </div>

          <div className='flex justify-end gap-22'>
            <div>
              <h1 className='font-aria font-extrabold text-[64px] text-black leading-[50px]'>+۲۰۰</h1>
              <p className='font-ray text-medium text-[14px] text-black'>محصول سالم و ارگانیک</p>
            </div>
            <div>
              <h1 className='font-aria font-extrabold text-[64px] text-black leading-[50px]'>+۵۰۰۰</h1>
              <p className='font-ray text-medium text-[14px] text-black'>مشتری از سراسر کشور </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2 – Cards Layout */}
      <div className="w-full flex flex-col items-center bg-[#161A1D]">

        {/* Title */}
        <h2 className="font-aria font-bold text-[50px] text-white text-center mt-16 mb-16 max-w-[730px] leading-[65px]">
          سرمایه‌ای که هیچ بانکی نمی‌تواند به شما بدهد
        </h2>

        {/* Cards Wrapper */}
        <div className="w-full max-w-[1200px] mx-auto grid grid-cols-[1fr_1fr_auto] gap-8 mb-16 pr-8 pl-8">

          {/* LEFT COLUMN (2 stacked) */}
          <div className="flex flex-col gap-6 md:col-span-2">
            {/* Top-left small card */}
            <div className="bg-[#1B2024] rounded-[24px] h-[199px] flex flex-col justify-center items-center">
              <h3 className="font-aria text-[30px] font-semibold text-white text-right max-w-[493px]">
                مطالعات نشان می‌دهد که{" "}
                <span className="text-[#B1C8FF]">۸۰٪</span>{" "}
                بیماری‌های مزمن با تغذیه و سبک زندگی سالم{" "}
                <span className="text-[#B1C8FF]">قابل پیشگیری</span>{" "}
                هستند
              </h3>
            </div>

            {/* Bottom-left small card */}
            <div className="bg-[#1B2024] rounded-[24px] h-[270px] pr-12 flex flex-col justify-center items-end">

              {/* Icon Circle */}
              <div className="flex justify-end mb-4">
                <div className="w-[70px] h-[70px] rounded-full bg-[#23282D] flex items-center justify-center">
                  <Image
                    src="/images/vital-signs.svg"
                    alt="Healthy Lifestyle"
                    width={35}
                    height={35}
                  />
                </div>
              </div>

              <h3 className="font-aria text-[30px] text-white text-right font-semibold leading-[45px]">حیات در دستانت</h3>
              <p className="font-ray text-[16px] text-[#6A7073] text-right leading-[22px] max-w-[536px]" dir="rtl">
                تحقیقات دانشگاه هاروارد نشان داده است که انتخاب یک رژیم غذایی متعادل می‌تواند امید به زندگی را بین ۱۰ تا ۱۴ سال افزایش دهد. این تنها به معنای سال‌های بیشتر نیست، بلکه به معنای سال‌هایی با کیفیت بالاتر است؛ سال‌هایی که می‌توانید با انرژی، تمرکز و آزادی بیشتری زندگی کنید.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN (tall card) */}
          <div className="bg-gradient-to-r from-[#B1C8FF] to-[#B4E4FF] rounded-[24px] w-[475px] h-[497px] p-6 pr-10 flex flex-col justify-center">
            {/* Icon Circle */}
            <div className="flex justify-end mb-6">
              <div className="w-[70px] h-[70px] rounded-full bg-[#23282D] flex items-center justify-center">
                <Image
                  src="/images/spa.svg"
                  alt="Healthy Lifestyle"
                  width={35}
                  height={35}
                />
              </div>
            </div>

            <h3 className="font-aria text-[30px] text-right font-semibold mb-4 leading-[20px]">
              سلامتی؛ بزرگ‌ترین سرمایه‌ زندگی
            </h3>

            <div
              className="font-ray text-[16px] text-[#6A7073] leading-[20px] whitespace-pre-line max-w-[600px] text-right"
              dir="rtl"
            >
              {`سلامتی نه یک «هزینه»، بلکه بنیادی‌ترین «سرمایه‌گذاری» زندگی است.
وقتی بدن شما انرژی پاک دارد، ذهن شما شفاف‌تر می‌شود. وقتی تغذیه شما سالم است، تصمیم‌هایتان عمیق‌تر و اثرگذارتر خواهند بود.

مطالعات اقتصادی نشان می‌دهد افرادی که سبک زندگی سالم دارند، به‌طور میانگین ۲۰٪ بهره‌وری بیشتری در کار دارند. یعنی اگر در هفته ۴۰ ساعت کار می‌کنید، یک فرد سالم معادل ۸ ساعت اضافه‌تر نتیجه می‌گیرد — بدون اینکه زمان بیشتری صرف کرده باشد.

همین اختلاف کوچک در طول سال‌ها به معنای تفاوت صدها میلیون تومان درآمد بالقوه است. از طرف دیگر، هزینه‌ی بی‌توجهی به سلامتی به شکل مستقیم روی جیب شما اثر می‌گذارد. تحقیقات جهانی تخمین می‌زنند که بیماری‌های قابل پیشگیری می‌توانند تا ۱۵ تا ۲۰٪ از درآمد کل عمر یک فرد را ببلعند؛ نه فقط به‌خاطر هزینه‌های درمان، بلکه به‌خاطر روزهایی که از کار و فرصت‌های مالی عقب می‌مانید.`}
            </div>
          </div>
        </div>
      </div>

      {/* Image Left, Text Right */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-[1200px] mx-auto mt-10">
        {/* Left: Image */}
        <div className="md:w-1/2 flex justify-start">
          <Image
            src="/images/herbs-one.svg"
            alt="Section 1 Image"
            width={800}
            height={800}
          />
        </div>

        {/* Right: Text */}
        <div className="md:w-1/2 flex flex-col justify-center items-end text-right">
          <h2 className="font-aria font-bold text-[40px] text-black leading-[50px] mb-4">
            پایه و سرمایه‌ای که کیفیت لحظه‌های زندگی با عزیزانت را تعیین می‌کند
          </h2>
          <div
            className="font-ray text-[22px] text-[#6A7073] leading-[24px] max-w-[591px] text-right whitespace-pre-line"
            dir="rtl"
          >
            {`زمانی که سلامتی هست، زندگی معنای دیگری دارد. بخش بزرگی از این معنا در لحظات کوچک و واقعی است که در آن حاضر میشویم: صدای خنده‌ی فرزندانمان، گفتگوی صمیمانه با همسر، لمس ساده‌ی صبحی آرام که پر از امید است. این‌ها سرمایه‌هایی‌اند که ارزششان با هیچ عددی سنجیده نمی‌شود.

اما وقتی سلامتی‌ات را نادیده می‌گیری، سایه‌ای سنگین بر همه‌ی این لحظات می‌افتد. انرژی‌ات ته می‌کشد، دردهای پنهان آرام‌آرام آشکار می‌شوند، و خستگی مداوم تو را از شادی‌های کوچک دور می‌کند. آن‌وقت حتی ساده‌ترین لحظات با عزیزانت، دست‌نیافتنی می‌شوند.

سرمایه‌گذاری روی بدن و ذهن امروزت یعنی ساختن آینده‌ای که در آن می‌توانی حاضر و پرانرژی کنار کسانی باشی که دوستشان داری. هر روز غفلت، یک خاطره‌ی ناب را از تو و خانواده‌ات می‌گیرد.`}
          </div>
        </div>
      </div>

      {/* Image Right, Text Left */}
      <div className="flex flex-col md:flex-row-reverse items-center justify-between w-full max-w-[1200px] mx-auto">
        {/* Right: Image */}
        <div className="md:w-1/2 flex justify-end">
          <Image
            src="/images/herbs-two.svg"
            alt="Section 2 Image"
            width={800}
            height={800}
          />
        </div>

        {/* Left: Text */}
        <div className="md:w-1/2 flex flex-col justify-center items-start text-right">
          <h2 className="font-aria font-bold text-[40px] text-black leading-[50px] mb-4">
            سرنوشتت پیری نیست، بلکه نتیجه‌ی انتخاب‌هایی است که امروز میگیری
          </h2>
          <div
            className="font-ray text-[22px] text-[#6A7073] leading-[24px] max-w-[591px] text-right whitespace-pre-line"
            dir="rtl"
          >
            {`شاید همیشه دیده‌ایم که پدر و مادر یا اطرافیان‌مان با بالا رفتن سن، آرام‌آرام توانایی‌هایشان را از دست داده‌اند؛ دردهای مزمن، انرژی کم، وابستگی به دارو و از دست رفتن آزادی عمل. ناخودآگاه باور کرده‌ایم که این سرنوشت ما هم خواهد بود. اما این فقط یک توهم است.

سلامتی آینده تو، حاصل تصمیم‌های امروز توست. اگر از همین حالا برای مراقبت از بدن و ذهن خود سرمایه‌گذاری کنی، می‌توانی سال‌های پیری را نه با بیماری و محدودیت، بلکه با انرژی، آزادی و حضور واقعی در کنار کسانی که دوستشان داری تجربه کنی. انتخاب با توست: تکرار چرخه‌ای که دیده‌ای، یا ساختن آینده‌ای که شایسته‌اش هستی.`}
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row items-center justify-between max-w-[1200px] mx-auto py-12 gap-10">

        {/* LEFT — Card with Image + Circle Icon */}
        <div className="relative w-full md:w-1/2 flex justify-center">
          <div className="bg-white shadow-lg rounded-2xl p-6 w-[665px] h-[745px] flex flex-col items-center">

            {/* Image */}
            <img
              src="/images/your-image.png"
              alt="Card Image"
              className="w-[220px] h-auto rounded-xl object-cover"
            />

            {/* Circle with Icon */}
            <div className="absolute top-[55%] right-[18%] w-[70px] h-[70px] bg-white rounded-full shadow-lg flex items-center justify-center">
              <img
                src="/icons/your-icon.svg"
                alt="Icon"
                className="w-[30px] h-[30px]"
              />
            </div>

          </div>
        </div>

        {/* RIGHT — Title + Paragraph */}
        <div className="w-full md:w-1/2 flex flex-col text-right items-end min-h-screen relative">

          {/* Title */}
          <h1 className="font-aria text-[64px] font-bold leading-[80px] text-black top-0 self-end py-4 bg-white/70 backdrop-blur z-10">
            سرمایه‌گذاری روی بدن، سرمایه‌گذاری روی آینده
          </h1>

          {/* Spacer pushes bottom content down */}
          <div className="flex-1"></div>

          {/* BOTTOM BLOCK — Acts as the “stop boundary” */}
          <div className="w-full flex flex-col items-end pb-4">
            <p className="font-ray text-[22px] text-[#6A7073] leading-[24px] mb-4" dir="rtl">
              بدن شما شایستهٔ زندگی‌ای پرانرژی و بدون محدودیت است. محصولات ارگانیک ما، ابزار شما برای ساختن فردایی سالم و طولانی است. همین حالا قدم اول را بردار و سرمایه‌گذاری روی سلامتت را آغاز کن.
            </p>

            <button className="bg-black text-white rounded-full flex items-center justify-between h-[54px] min-w-[187px] px-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-none">
                <Image src="/images/arrow.svg" alt="Arrow" width={20} height={20} className="rotate-[45deg]" />
              </div>

              <span className="font-ray font-medium text-[16px] text-white whitespace-nowrap mr-2">
                مشاهده محصولات
              </span>
            </button>
          </div>

        </div>
      </div>

      <div className="w-full flex flex-col md:flex-row-reverse items-center justify-between max-w-[1200px] mx-auto py-12 gap-10">

        {/* RIGHT — Card with Image + Icon */}
        <div className="relative w-full md:w-1/2 flex justify-center">
          <div className="bg-white shadow-lg rounded-2xl p-6 w-[665px] h-[745px] flex flex-col items-center">

            {/* Image */}
            <img
              src="/images/your-image.png"
              alt="Card Image"
              className="w-[220px] h-auto rounded-xl object-cover"
            />

            {/* Circle with Icon */}
            <div className="absolute top-[55%] right-[18%] w-[70px] h-[70px] bg-white rounded-full shadow-lg flex items-center justify-center">
              <img
                src="/icons/your-icon.svg"
                alt="Icon"
                className="w-[30px] h-[30px]"
              />
            </div>

          </div>
        </div>

        {/* RIGHT — Title + Paragraph */}
        <div className="w-full md:w-1/2 flex flex-col text-right items-start min-h-screen relative">

          {/* Title */}
          <h1 className="font-aria text-[64px] font-bold leading-[80px] text-black top-0 self-end py-4 bg-white/70 backdrop-blur z-10">
            یک تست هوشمند، برای آینده‌ای بدون محدودیت
          </h1>

          {/* Spacer pushes bottom content down */}
          <div className="flex-1"></div>

          {/* BOTTOM BLOCK — Acts as the “stop boundary” */}
          <div className="w-full flex flex-col items-end pb-4">
            <p className="font-ray text-[22px] text-[#6A7073] leading-[24px] mb-4" dir="rtl">
              با یک تست هوش مصنوعی ساده، برنامه غذایی و مسیر سلامتی شخصی خود را دریافت کن. ارزش واقعی این ابزار، در سرمایه‌گذاری امروز شما روی انرژی، شفافیت ذهنی و طول عمر فرداست — و کاملاً رایگان هست.
            </p>

            <button className="bg-black text-white rounded-full flex items-center justify-between h-[54px] min-w-[187px] px-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-none">
                <Image src="/images/arrow.svg" alt="Arrow" width={20} height={20} className="rotate-[45deg]" />
              </div>

              <span className="font-ray font-medium text-[16px] text-white whitespace-nowrap mr-2">
                مشاهده محصولات
              </span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}