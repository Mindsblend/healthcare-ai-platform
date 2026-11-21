import { PrismaClient } from './src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error'],
})

async function main() {
  // 1. Database connection info
  const dbInfo = await prisma.$queryRaw`SELECT 
    current_database() as database_name,
    inet_server_addr() as host,
    inet_server_port() as port,
    version() as pg_version`
  console.log('=== DATABASE CONNECTION INFO ===')
  console.log(JSON.stringify(dbInfo, null, 2))

  // 2. Record counts
  const counts = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
    prisma.cart.count(),
    prisma.collection.count(),
    prisma.blog.count(),
  ])
  console.log('\n=== RECORD COUNTS ===')
  console.log('User:', counts[0])
  console.log('Product:', counts[1])
  console.log('Category:', counts[2])
  console.log('Order:', counts[3])
  console.log('Cart:', counts[4])
  console.log('Collection:', counts[5])
  console.log('Blog:', counts[6])

  // 3. Latest 5 products
  const products = await prisma.product.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, createdAt: true, isActive: true, price: true }
  })
  console.log('\n=== LATEST 5 PRODUCTS ===')
  console.log(JSON.stringify(products, null, 2))

  // 4. Latest 5 users
  const users = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { id: true, email: true, phone: true, firstName: true, lastName: true, createdAt: true }
  })
  console.log('\n=== LATEST 5 USERS ===')
  console.log(JSON.stringify(users, null, 2))

  // 5. Latest 5 orders
  const orders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { id: true, userId: true, status: true, totalPrice: true, createdAt: true }
  })
  console.log('\n=== LATEST 5 ORDERS ===')
  console.log(JSON.stringify(orders, null, 2))

  // 6. Migration history
  const migrations = await prisma.$queryRaw`SELECT migration_name, finished_at FROM _prisma_migrations ORDER BY finished_at DESC`
  console.log('\n=== PRISMA MIGRATIONS ===')
  console.log(JSON.stringify(migrations, null, 2))

  // 7. Check some sample data
  const sampleProduct = await prisma.product.findFirst({
    select: { id: true, title: true, description: true, slug: true, category: { select: { name: true } } }
  })
  console.log('\n=== SAMPLE PRODUCT ===')
  console.log(JSON.stringify(sampleProduct, null, 2))

  const sampleOrder = await prisma.order.findFirst({
    include: { items: { include: { product: { select: { title: true } } } } }
  })
  console.log('\n=== SAMPLE ORDER WITH ITEMS ===')
  console.log(JSON.stringify(sampleOrder, null, 2))
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())