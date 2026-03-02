/*
  Warnings:

  - Changed the type of `discount_type` on the `coupons` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED');

-- AlterTable
ALTER TABLE "coupons" DROP COLUMN "discount_type",
ADD COLUMN     "discount_type" "DiscountType" NOT NULL;
