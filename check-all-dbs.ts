import { Pool } from 'pg'

const pool = new Pool({
  connectionString: "postgresql://postgres:kian13871387@localhost:5432/postgres?schema=public",
})

async function main() {
  // List all databases
  const databases = await pool.query(`
    SELECT datname FROM pg_database WHERE datistemplate = false ORDER BY datname
  `)
  console.log('=== ALL DATABASES ===')
  console.log(databases.rows.map(r => r.datname).join(', '))

  // Check each database for counts
  for (const db of databases.rows) {
    const dbName = db.datname
    if (dbName === 'postgres') continue
    
    try {
      const dbPool = new Pool({
        connectionString: `postgresql://postgres:kian13871387@localhost:5432/${dbName}?schema=public`,
      })
      
      const [productCount, userCount, orderCount, categoryCount, versionResult] = await Promise.all([
        dbPool.query('SELECT COUNT(*) FROM "Product"').catch(() => ({ rows: [{count: 'N/A'}] })),
        dbPool.query('SELECT COUNT(*) FROM "User"').catch(() => ({ rows: [{count: 'N/A'}] })),
        dbPool.query('SELECT COUNT(*) FROM "Order"').catch(() => ({ rows: [{count: 'N/A'}] })),
        dbPool.query('SELECT COUNT(*) FROM "Category"').catch(() => ({ rows: [{count: 'N/A'}] })),
        dbPool.query('SELECT version()'),
      ])
      
      console.log(`\n--- ${dbName} ---`)
      console.log(`  Products: ${productCount.rows[0].count}`)
      console.log(`  Users: ${userCount.rows[0].count}`)
      console.log(`  Orders: ${orderCount.rows[0].count}`)
      console.log(`  Categories: ${categoryCount.rows[0].count}`)
      console.log(`  PG Version: ${versionResult.rows[0].version.split(' ')[0]} ${versionResult.rows[0].version.split(' ')[1]}`)
      
      await dbPool.end()
    } catch (e) {
      console.log(`\n--- ${dbName} --- ERROR: ${e.message}`)
    }
  }
  
  await pool.end()
}

main().catch(console.error)