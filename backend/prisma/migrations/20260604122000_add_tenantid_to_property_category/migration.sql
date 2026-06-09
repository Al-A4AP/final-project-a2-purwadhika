ALTER TABLE "property_categories"
ADD COLUMN "tenantId" TEXT;

ALTER TABLE "property_categories"
ADD CONSTRAINT "property_categories_tenantId_fkey"
FOREIGN KEY ("tenantId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE UNIQUE INDEX "property_categories_tenantId_name_key"
ON "property_categories"("tenantId", "name");
