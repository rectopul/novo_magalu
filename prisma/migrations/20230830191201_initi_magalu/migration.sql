/*
  Warnings:

  - Added the required column `force_pix` to the `products_config` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products_config" ADD COLUMN     "force_pix" BOOLEAN NOT NULL;
