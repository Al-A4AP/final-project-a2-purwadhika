-- CreateEnum
CREATE TYPE "VoucherDiscountType" AS ENUM ('PERCENTAGE', 'NOMINAL');

-- AlterTable
ALTER TABLE "users" ADD COLUMN "referral_code" TEXT;

-- AlterTable
ALTER TABLE "orders"
ADD COLUMN "subtotal_price" INTEGER,
ADD COLUMN "discount_amount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "voucherId" TEXT;

-- CreateTable
CREATE TABLE "vouchers" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "discount_type" "VoucherDiscountType" NOT NULL DEFAULT 'PERCENTAGE',
  "discount_value" INTEGER NOT NULL,
  "max_discount" INTEGER,
  "quota" INTEGER,
  "used_count" INTEGER NOT NULL DEFAULT 0,
  "starts_at" TIMESTAMP(3) NOT NULL,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "new_user_only" BOOLEAN NOT NULL DEFAULT false,
  "deleted_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "vouchers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_vouchers" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "voucherId" TEXT NOT NULL,
  "expires_at" TIMESTAMP(3),
  "used_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "user_vouchers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_referral_code_key" ON "users"("referral_code");
CREATE UNIQUE INDEX "vouchers_code_key" ON "vouchers"("code");
CREATE INDEX "vouchers_tenantId_idx" ON "vouchers"("tenantId");
CREATE INDEX "vouchers_code_idx" ON "vouchers"("code");
CREATE INDEX "vouchers_is_active_starts_at_expires_at_idx" ON "vouchers"("is_active", "starts_at", "expires_at");
CREATE UNIQUE INDEX "user_vouchers_userId_voucherId_key" ON "user_vouchers"("userId", "voucherId");
CREATE INDEX "user_vouchers_userId_idx" ON "user_vouchers"("userId");
CREATE INDEX "user_vouchers_voucherId_idx" ON "user_vouchers"("voucherId");
CREATE INDEX "orders_voucherId_idx" ON "orders"("voucherId");

-- AddForeignKey
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "user_vouchers" ADD CONSTRAINT "user_vouchers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_vouchers" ADD CONSTRAINT "user_vouchers_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "vouchers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "orders" ADD CONSTRAINT "orders_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "vouchers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
