/*
  Warnings:

  - Added the required column `statusId` to the `order_products` table without a default value. This is not possible if the table is not empty.

*/

-- ✅ Adiciona coluna statusId com valor padrão "Aguardando" para registros existentes
ALTER TABLE "order_products" ADD COLUMN "statusId" TEXT;

-- ✅ Atualiza registros existentes com o status "Aguardando"
UPDATE "order_products" 
SET "statusId" = (SELECT id FROM "order_status" WHERE name = 'Aguardando' LIMIT 1)
WHERE "statusId" IS NULL;

-- ✅ Torna a coluna NOT NULL após preencher os dados existentes
ALTER TABLE "order_products" ALTER COLUMN "statusId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "order_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
