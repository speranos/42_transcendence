/*
  Warnings:

  - The primary key for the `RoomMembership` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropIndex
DROP INDEX "RoomMembership_userID_key";

-- AlterTable
ALTER TABLE "RoomMembership" DROP CONSTRAINT "RoomMembership_pkey",
ADD CONSTRAINT "RoomMembership_pkey" PRIMARY KEY ("userID", "roomID");
