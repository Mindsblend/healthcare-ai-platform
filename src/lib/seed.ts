import { prisma } from './prisma.ts'

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

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { title: product.title },
      update: { ...product },
      create: { ...product },
    })
  }
  console.log('Products seeded successfully.')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
