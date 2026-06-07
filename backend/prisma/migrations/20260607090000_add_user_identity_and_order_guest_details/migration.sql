-- AlterTable
ALTER TABLE "users"
ADD COLUMN "legal_name" TEXT,
ADD COLUMN "ktp_address" TEXT,
ADD COLUMN "domicile_address" TEXT;

-- AlterTable
ALTER TABLE "orders"
ADD COLUMN "booking_for_self" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "guest_name" TEXT,
ADD COLUMN "guest_legal_name" TEXT,
ADD COLUMN "guest_phone" TEXT,
ADD COLUMN "guest_email" TEXT,
ADD COLUMN "guest_ktp_address" TEXT,
ADD COLUMN "guest_domicile_address" TEXT;
