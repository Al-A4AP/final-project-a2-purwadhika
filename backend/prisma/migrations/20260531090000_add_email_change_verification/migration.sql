-- AlterTable
ALTER TABLE "users" ADD COLUMN "pending_email" TEXT;
ALTER TABLE "users" ADD COLUMN "email_change_requested_at" TIMESTAMP(3);

-- CreateEnum
CREATE TYPE "EmailVerificationPurpose" AS ENUM ('ACCOUNT_ACTIVATION', 'EMAIL_CHANGE');

-- AlterTable
ALTER TABLE "email_verifications"
ADD COLUMN "purpose" "EmailVerificationPurpose" NOT NULL DEFAULT 'ACCOUNT_ACTIVATION',
ADD COLUMN "target_email" TEXT;

-- CreateIndex
CREATE INDEX "email_verifications_userId_purpose_idx"
ON "email_verifications"("userId", "purpose");
