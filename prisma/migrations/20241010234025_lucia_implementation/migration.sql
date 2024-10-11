/*
  Warnings:

  - You are about to drop the column `key` on the `Session` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ipAddress` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userAgent` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Session_key_key";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "key",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "ipAddress" TEXT NOT NULL,
ADD COLUMN     "userAgent" TEXT NOT NULL,
ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("id");
