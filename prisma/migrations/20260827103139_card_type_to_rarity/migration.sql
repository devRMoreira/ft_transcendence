/*
  Warnings:

  - You are about to drop the column `type` on the `Card` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Card_type_idx";

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "type",
ADD COLUMN     "rarity" TEXT;

-- CreateIndex
CREATE INDEX "Card_rarity_idx" ON "Card"("rarity");
