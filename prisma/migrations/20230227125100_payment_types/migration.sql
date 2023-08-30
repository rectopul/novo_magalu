/*
  Warnings:

  - You are about to drop the column `payment_type` on the `products_config` table. All the data in the column will be lost.
  - Added the required column `payment_type_boleto` to the `products_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_type_card` to the `products_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_type_pix` to the `products_config` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products_config" DROP COLUMN "payment_type",
ADD COLUMN     "payment_type_boleto" BOOLEAN NOT NULL,
ADD COLUMN     "payment_type_card" BOOLEAN NOT NULL,
ADD COLUMN     "payment_type_pix" BOOLEAN NOT NULL;
