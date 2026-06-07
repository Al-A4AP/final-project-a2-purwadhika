-- AlterTable
ALTER TABLE "orders" ADD COLUMN "referral_code" TEXT;

-- CreateTable
CREATE TABLE "referral_rewards" (
  "id" TEXT NOT NULL,
  "referrerId" TEXT NOT NULL,
  "referredUserId" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "voucherId" TEXT,
  "reward_code" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "referral_rewards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "orders_referral_code_idx" ON "orders"("referral_code");
CREATE UNIQUE INDEX "referral_rewards_orderId_key" ON "referral_rewards"("orderId");
CREATE INDEX "referral_rewards_referrerId_idx" ON "referral_rewards"("referrerId");
CREATE INDEX "referral_rewards_referredUserId_idx" ON "referral_rewards"("referredUserId");
CREATE INDEX "referral_rewards_voucherId_idx" ON "referral_rewards"("voucherId");

-- AddForeignKey
ALTER TABLE "referral_rewards" ADD CONSTRAINT "referral_rewards_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "referral_rewards" ADD CONSTRAINT "referral_rewards_referredUserId_fkey" FOREIGN KEY ("referredUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "referral_rewards" ADD CONSTRAINT "referral_rewards_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "referral_rewards" ADD CONSTRAINT "referral_rewards_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "vouchers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
