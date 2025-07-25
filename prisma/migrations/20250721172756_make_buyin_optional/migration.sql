/*
  Warnings:

  - You are about to alter the column `buyIn` on the `Tournament` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `prizePool` on the `Tournament` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `buyIn` on the `TournamentEvent` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `prizePool` on the `TournamentEvent` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tournament" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "country" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "buyIn" INTEGER,
    "prizePool" INTEGER,
    "description" TEXT,
    "link" TEXT
);
INSERT INTO "new_Tournament" ("addressLine1", "addressLine2", "buyIn", "city", "country", "description", "endDate", "id", "link", "location", "name", "postalCode", "prizePool", "startDate", "state", "venue") SELECT "addressLine1", "addressLine2", "buyIn", "city", "country", "description", "endDate", "id", "link", "location", "name", "postalCode", "prizePool", "startDate", "state", "venue" FROM "Tournament";
DROP TABLE "Tournament";
ALTER TABLE "new_Tournament" RENAME TO "Tournament";
CREATE TABLE "new_TournamentEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tournamentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "buyIn" INTEGER,
    "prizePool" INTEGER,
    "description" TEXT,
    CONSTRAINT "TournamentEvent_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TournamentEvent" ("buyIn", "description", "endDate", "id", "name", "prizePool", "startDate", "tournamentId") SELECT "buyIn", "description", "endDate", "id", "name", "prizePool", "startDate", "tournamentId" FROM "TournamentEvent";
DROP TABLE "TournamentEvent";
ALTER TABLE "new_TournamentEvent" RENAME TO "TournamentEvent";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
