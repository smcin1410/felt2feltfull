/*
  Warnings:

  - Added the required column `casinoName` to the `Destination` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Destination" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "casinoName" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "country" TEXT NOT NULL,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "region" TEXT,
    "postalCode" TEXT,
    "description" TEXT NOT NULL,
    "imageKey" TEXT NOT NULL,
    "tags" TEXT,
    "website" TEXT,
    "pokerRoomInfo" JSONB,
    "travelerInformation" TEXT
);
INSERT INTO "new_Destination" ("addressLine1", "addressLine2", "city", "country", "description", "id", "imageKey", "postalCode", "state", "tags") SELECT "addressLine1", "addressLine2", "city", "country", "description", "id", "imageKey", "postalCode", "state", "tags" FROM "Destination";
DROP TABLE "Destination";
ALTER TABLE "new_Destination" RENAME TO "Destination";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
