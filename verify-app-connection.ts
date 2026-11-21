import { PrismaClient } from './src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// Use the exact same initialization as src/lib/prisma.ts
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error'],
})

async function main() {
  // 1. Connection info through the actual app connection
  const dbInfo = await prisma.$queryRaw`SELECT 
    current_database() as database_name,
    current_schema() as schema_name,
    version() as pg_version`
  console.log('=== APPLICATION DATABASE CONNECTION ===')
  console.log(JSON.stringify(dbInfo, null, 2))

  // 2. Count through the same connection
  const [productCount, userCount, orderCount, categoryCount] = await Promise.all([
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.count(),
    prisma.category.count(),
  ])
  console.log('\n=== COUNTS VIA APP CONNECTION ===')
  console.log('Products:', productCount)
  console.log('Users:', userCount)
  console.log('Orders:', orderCount)
  console.log('Categories:', categoryCount)

  // 3. Latest products
  const products = await prisma.product.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, createdAt: true, isActive: true, price: true }
  })
  console.log('\n=== LATEST 10 PRODUCTS ===')
  console.log(JSON.stringify(products, null, 2))

  // 4. Check environment
  console.log('\n=== ENVIRONMENT ===')
  console.log('NODE_ENV:', process.env.NODE_ENV)
  console.log('DATABASE_URL (masked):', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':***@'))
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())