import { prisma } from './prisma.ts'
import generateSlug from './helpers.ts'

/* =======================
   PRODUCTS
======================= */

const products = [
  {
    title: 'کرم آبرسان',
    price: 320000,
    image: '/images/product-one.svg',
    description:
      'کرم آبرسان با ترکیبی از ویتامین‌ها و عصاره‌های گیاهی، رطوبت عمقی پوست را تأمین می‌کند و از خشکی و خستگی پوست جلوگیری می‌کند.',
    solution: 'خشکی پوست را سریع برطرف می‌کند و نرمی و شادابی می‌بخشد',
  },
  {
    title: 'عرق خونساز',
    price: 543000,
    image: '/images/product-two.svg',
    description:
      'عرق خونساز با فرمولی طبیعی و غنی از عناصر حیاتی، به تقویت خون و بهبود عملکرد سیستم گردش خون کمک می‌کند.',
    solution: 'کم‌خونی را کاهش می‌دهد و انرژی بدن را سریع افزایش می‌دهد',
  },
  {
    title: 'کرم زالو',
    price: 233000,
    image: '/images/product-three.svg',
    description:
      'کرم زالو با عصاره‌های فعال، رطوبت و نرمی لازم را برای حفظ لطافت و انعطاف‌پذیری پوست فراهم می‌کند.',
    solution: 'خشکی و خشن بودن پوست را سریع برطرف می‌کند و لطافت می‌بخشد',
  },
  {
    title: 'ماسک مو ترمیمی',
    price: 99000,
    image: '/images/product-four.svg',
    description:
      'ماسک مو ترمیمی تارهای آسیب‌دیده را بازسازی کرده و درخشندگی و نرمی طبیعی موها را بازمی‌گرداند.',
    solution: 'موهای آسیب‌دیده را سریع ترمیم و درخشان می‌کند',
  },
  {
    title: 'سرم ویتامینه',
    price: 420000,
    image: '/images/product-five.svg',
    description:
      'سرم ویتامینه پوست را تغذیه و بازسازی می‌کند، شفافیت و لطافت طبیعی را افزایش می‌دهد.',
    solution: 'پوست کدر و خسته را سریع شفاف و جوان می‌کند',
  },
  {
    title: 'شامپو گیاهی',
    price: 86000,
    image: '/images/product-six.svg',
    description:
      'شامپو گیاهی موها را پاکسازی کرده و سلامت پوست سر را حفظ می‌کند.',
    solution: 'موهای ضعیف و خشک را سریع سالم و نرم می‌کند',
  },
]

async function seedProducts() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { title: product.title },
      update: { ...product, slug: generateSlug(product.title) },
      create: { ...product, slug: generateSlug(product.title) },
    })
  }
  console.log('✅ Products seeded')
}

/* =======================
   BLOGS
======================= */

const blogs = [
  {
    title: 'هوش مصنوعی و آینده سلامتی شخصی',
    image: '/images/blog-1.svg',
    author: 'رضا میلادپور',
    authorImage: '/images/arash.svg',
    description:
      'تکنولوژی تنها برای کار و سرگرمی نیست؛ می‌تواند برای سلامتی شما هم معجزه کند. در این مطلب می‌بینید که چگونه هوش مصنوعی می‌تواند سبک زندگی شما را آنالیز کند.',
  },
  {
    title: 'قدرت تغذیه ارگانیک در زندگی مدرن',
    image: '/images/blog-2.svg',
    author: 'آناهیتا قدردان',
    authorImage: '/images/sara.svg',
    description:
      'غذا فقط سوخت بدن نیست؛ در این مقاله بررسی می‌کنیم چرا محصولات ارگانیک یک انتخاب لوکس نیستند، بلکه ضرورتی حیاتی برای دنیای پر استرس امروزند.',
  },
  {
    title: 'چطور استرس، بدنت را فرسوده می‌کند',
    image: '/images/blog-3.svg',
    author: 'مصطفا ارجمند',
    authorImage: '/images/amir.svg',
    description:
      'طول عمر بیشتر نتیجه شانس نیست، بلکه نتیجه انتخاب‌های روزانه است. از خواب کافی تا تغذیه سالم، این ۵ عادت کوچک می‌توانند تفاوت بزرگی در کیفیت و سال‌های زندگی شما ایجاد کنند.',
  },
  {
    title: 'اشتباهات رایج که سلامت مو را کم می‌کند',
    image: '/images/blog-4.png',
    author: 'داوود رضوی',
    authorImage: '/images/arash.svg',
    description:
      'این نوشته بررسی می‌کند کدام عادت‌ها باعث آسیب مو می‌شوند و چطور می‌توانی سلامت و درخشندگی موهایت را برگردانی.',
  },
  {
    title: 'خوراکی‌های ضدالتهاب برای انرژی پایدار',
    image: '/images/blog-5.jpg',
    author: 'پیمان نصیری ',
    authorImage: '/images/fariborz.svg',
    description:
      'در این مقاله با خوراکی‌هایی آشنا می‌شوی که التهاب بدن را کاهش می‌دهند و به بهبود عملکرد سیستم ایمنی کمک می‌کنند.',
  },
  {
    title: 'تغذیه سالم برای روزهای شلوغ و پرکار',
    image: '/images/blog-6.jpg',
    author: 'سارا کیانی',
    authorImage: '/images/sara.svg',
    description:
      'اگر وقت آشپزی نداری ولی می‌خواهی سالم‌تر زندگی کنی، این مقاله برای توست. راهکارهای سریع و عملی.',
  },
  {
    title: 'ماسک‌های طبیعی پوست برای شفافیت بیشتر',
    image: '/images/blog-7.jpg',
    author: 'مرضیه افشار',
    authorImage: '/images/nazanin.svg',
    description:
      'ترکیب‌های ساده و طبیعی که بدون هزینه بالا، پوست را شفاف و تازه می‌کنند. دستورها کاملاً تست‌شده‌اند.',
  },
]

async function seedBlogs() {
  for (const blog of blogs) {
    await prisma.blog.upsert({
      where: { title: blog.title },
      update: { ...blog },
      create: { ...blog },
    })
  }
  console.log('✅ Blogs seeded')
}

/* =======================
   MAIN
======================= */

async function main() {
  await seedProducts()
  await seedBlogs()
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
