/*
  Warnings:

  - You are about to drop the column `type` on the `Email` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Email" DROP COLUMN "type",
ADD COLUMN     "types" "public"."EmailType"[];
