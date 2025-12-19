import { prisma } from '../lib/prisma.ts'

async function main() {
  // Step 1: Upsert all categories
  const categories = [
    { id: 1, name: 'پوست و مو' },
    { id: 2, name: 'مکمل ها' },
    { id: 3, name: 'مراقبت ذهنی' },
    { id: 4, name: 'حیوانات' },
    { id: 5, name: 'موادغذایی' },
    { id: 6, name: 'لوازم خانه' },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {},
      create: { id: category.id, name: category.name },
    })
  }

  console.log(`✅ Ensured ${categories.length} categories exist`)

  // Step 2: Map products to category IDs
  const productCategoryMapping: Record<string, number> = {
    'کرم آبرسان': 1,      // پوست و مو
    'عرق خونساز': 2,      // مکمل ها
    'کرم زالو': 1,         // پوست و مو
    'ماسک مو ترمیمی': 1,  // پوست و مو
    'سرم ویتامینه': 1,    // پوست و مو
    'شامپو گیاهی': 1,     // پوست و مو
  }

  // Step 3: Backfill products
  const products = await prisma.product.findMany({
    where: { categoryId: null }, // only update products without category
  })

  for (const product of products) {
    const catId = productCategoryMapping[product.title]
    if (!catId) {
      console.warn(`⚠️ No category mapping for product: ${product.title}`)
      continue
    }

    await prisma.product.update({
      where: { id: product.id },
      data: { categoryId: catId },
    })
    console.log(`✅ Updated ${product.title} with categoryId ${catId}`)
  }

  console.log(`✅ Backfilled ${products.length} products with categoryId`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })