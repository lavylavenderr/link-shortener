/*
  Warnings:

  - You are about to drop the column `shortUrl` on the `Link` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Link" DROP COLUMN "shortUrl";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
