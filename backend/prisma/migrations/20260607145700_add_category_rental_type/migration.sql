-- CreateEnum
CREATE TYPE "RentalType" AS ENUM ('PER_ROOM', 'WHOLE_PROPERTY');

-- AlterTable
ALTER TABLE "property_categories" ADD COLUMN "description" TEXT,
ADD COLUMN "default_rental_type" "RentalType" NOT NULL DEFAULT 'PER_ROOM';

-- AlterTable
ALTER TABLE "properties" ADD COLUMN "rental_type" "RentalType" NOT NULL DEFAULT 'PER_ROOM';

-- AlterTable
ALTER TABLE "orders" ADD COLUMN "payment_rejection_reason" TEXT;
