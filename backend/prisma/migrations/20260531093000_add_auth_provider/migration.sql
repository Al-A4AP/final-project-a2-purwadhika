-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('EMAIL', 'GOOGLE');

-- AlterTable
ALTER TABLE "users"
ADD COLUMN "auth_provider" "AuthProvider" NOT NULL DEFAULT 'EMAIL',
ADD COLUMN "password_set_at" TIMESTAMP(3);

-- Backfill verified email/password accounts so existing seeded/demo users keep reset-password support.
UPDATE "users"
SET "password_set_at" = COALESCE("verified_at", "created_at")
WHERE "verified_at" IS NOT NULL
AND "password_set_at" IS NULL;
