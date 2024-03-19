/*
  Warnings:

  - You are about to drop the column `OAuth` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[gameID]` on the table `Games` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_OAuth_key";

-- AlterTable
ALTER TABLE "Requests" ADD COLUMN     "ifGameID" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "OAuth";

-- CreateIndex
CREATE UNIQUE INDEX "Games_gameID_key" ON "Games"("gameID");
