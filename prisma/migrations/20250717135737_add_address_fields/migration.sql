-- AlterTable
ALTER TABLE "Destination" ADD COLUMN "addressLine1" TEXT;
ALTER TABLE "Destination" ADD COLUMN "addressLine2" TEXT;
ALTER TABLE "Destination" ADD COLUMN "postalCode" TEXT;

-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN "addressLine1" TEXT;
ALTER TABLE "Tournament" ADD COLUMN "addressLine2" TEXT;
ALTER TABLE "Tournament" ADD COLUMN "city" TEXT;
ALTER TABLE "Tournament" ADD COLUMN "country" TEXT;
ALTER TABLE "Tournament" ADD COLUMN "postalCode" TEXT;
ALTER TABLE "Tournament" ADD COLUMN "state" TEXT;
