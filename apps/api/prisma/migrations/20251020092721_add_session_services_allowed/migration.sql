/*
  Warnings:

  - Added the required column `reason` to the `reports` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "services" TEXT[];

-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "reason" TEXT NOT NULL;
