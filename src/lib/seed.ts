import { prisma } from './prisma.ts'

/* =======================
   PRODUCTS
======================= */

const products = [
  {
    title: 'کرم آبرسان',
    price: 320000,
    image: '/images/product-one.svg',
    description:
      'کرم‌ها می‌تونن مواد مفیدی مثل ویتامین‌، یا عصاره‌ گیاهی داشته باشن',
  },
  {
    title: 'عرق خونساز',
    price: 543000,
    image: '/images/product-two.svg',
    description: 'درمان کمخونی با روش ایمن برای سلامت بهتر ',
  },
  {
    title: 'کرم زالو',
    price: 233000,
    image: '/images/product-three.svg',
    description: 'جلوگیری از خشکی پوست با تامین آب و رطوبت لازم',
  },
  {
    title: 'ماسک مو ترمیمی',
    price: 99000,
    image: '/images/product-four.svg',
    description: 'بازسازی تارهای آسیب‌دیده و ایجاد نرمی و درخشش طبیعی مو',
  },
  {
    title: 'سرم ویتامینه',
    price: 420000,
    image: '/images/product-five.svg',
    description: 'کمک به تقویت پوست با جذب سریع مواد مغذی و ویتامین‌ها',
  },
  {
    title: 'شامپو گیاهی',
    price: 86000,
    image: '/images/product-six.svg',
    description: 'پاکسازی ملایم مو بدون آسیب با ترکیبات طبیعی و سالم',
  },
]

async function seedProducts() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { title: product.title },
      update: { ...product },
      create: { ...product },
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
