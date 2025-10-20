/*
  Warnings:

  - The values [CLASSIC,PRO] on the enum `ProfileType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."LogLevel" AS ENUM ('INFO', 'WARNING', 'ERROR', 'CRITICAL');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."ProfileType_new" AS ENUM ('STANDARD', 'BUSINESS');
ALTER TABLE "public"."Profile" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "public"."Profile" ALTER COLUMN "type" TYPE "public"."ProfileType_new" USING ("type"::text::"public"."ProfileType_new");
ALTER TYPE "public"."ProfileType" RENAME TO "ProfileType_old";
ALTER TYPE "public"."ProfileType_new" RENAME TO "ProfileType";
DROP TYPE "public"."ProfileType_old";
ALTER TABLE "public"."Profile" ALTER COLUMN "type" SET DEFAULT 'STANDARD';
COMMIT;

-- AlterTable
ALTER TABLE "public"."Profile" ALTER COLUMN "type" SET DEFAULT 'STANDARD';

-- CreateTable
CREATE TABLE "public"."SystemLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "level" "public"."LogLevel" NOT NULL DEFAULT 'INFO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SystemLog_pkey" PRIMARY KEY ("id")
);
