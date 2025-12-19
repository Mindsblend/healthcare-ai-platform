/*
  Warnings:

  - Made the column `categoryId` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/

-- Backfill existing products with correct category IDs
UPDATE "Product" SET "categoryId" = 1 WHERE "title" IN (
  'کرم آبرسان',
  'کرم زالو',
  'سرم ویتامینه'
); -- assuming 1 = پوست و مو

UPDATE "Product" SET "categoryId" = 2 WHERE "title" = 'عرق خونساز'; -- 2 = مکمل ها

UPDATE "Product" SET "categoryId" = 1 WHERE "title" IN (
  'ماسک مو ترمیمی',
  'شامپو گیاهی'
); -- 1 = پوست و مو


-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "categoryId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
