import { prisma } from '../lib/prisma.ts'

async function main() {
  const products = await prisma.product.findMany({
    where: { solution: null }, // only update rows without solution
  })

  for (const product of products) {
    await prisma.product.update({
      where: { id: product.id },
      data: { solution: product.description },
    })
  }

  console.log(`✅ Backfilled ${products.length} products with solutions`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
