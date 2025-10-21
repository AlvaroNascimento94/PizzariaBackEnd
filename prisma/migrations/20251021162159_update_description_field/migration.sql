/*
  Warnings:

  - You are about to drop the column `description` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "order_products" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "description";
