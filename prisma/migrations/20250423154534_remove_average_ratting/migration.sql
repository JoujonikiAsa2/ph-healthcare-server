/*
  Warnings:

  - You are about to drop the column `averageRating` on the `doctors` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "averageRating",
ALTER COLUMN "experience" SET DEFAULT 0;
