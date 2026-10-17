import { afterAll, describe, expect, it } from 'vitest'
import { prisma } from '@/lib/prisma'

describe('Database integration', () => {
  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('connects to the test database and performs a real read/write cycle', async () => {
    const result = await prisma.$transaction(async (tx) => {
      const databases = await tx.$queryRaw<
        Array<{ database_name: string }>
      >`SELECT current_database() AS database_name`

      const databaseName = databases[0]?.database_name

      if (databaseName !== 'digisalamat_test') {
        throw new Error(
          `Safety check failed: expected digisalamat_test, connected to ${
            databaseName ?? 'unknown'
          }`,
        )
      }

      await tx.$executeRaw`
        CREATE TEMP TABLE "IntegrationProbe" (
          "id" INTEGER PRIMARY KEY,
          "value" TEXT NOT NULL
        ) ON COMMIT DROP
      `

      await tx.$executeRaw`
        INSERT INTO "IntegrationProbe" ("id", "value")
        VALUES (1, ${'integration-ok'})
      `

      const rows = await tx.$queryRaw<
        Array<{ id: number; value: string }>
      >`SELECT "id", "value"
        FROM "IntegrationProbe"
        WHERE "id" = 1`

      return { databaseName, rows }
    })

    expect(result.databaseName).toBe('digisalamat_test')
    expect(result.rows).toEqual([{ id: 1, value: 'integration-ok' }])
  })
})
