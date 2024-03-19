-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('DENIED', 'ACCEPTED', 'PENDING');

-- CreateEnum
CREATE TYPE "FriendshipStatus" AS ENUM ('FRIENDS', 'BLOCKED');

-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('GAME', 'FRIENDSHIP');

-- CreateEnum
CREATE TYPE "Mode" AS ENUM ('REGULAR', 'SUPER');

-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('DM', 'PUBLIC', 'PRIVATE', 'PASSWORD_PROTECTED');

-- CreateEnum
CREATE TYPE "RoomRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'BANNED');

-- CreateTable
CREATE TABLE "User" (
    "userID" TEXT NOT NULL,
    "avatar" TEXT NOT NULL DEFAULT './data/default.jpeg',
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "secret2FA" TEXT,
    "auth2FA_id" TEXT,
    "RTokens" TEXT NOT NULL,
    "finishedProfile" BOOLEAN NOT NULL DEFAULT false,
    "userOnline" BOOLEAN NOT NULL DEFAULT false,
    "userInGame" BOOLEAN NOT NULL DEFAULT false,
    "userWaiting" BOOLEAN NOT NULL DEFAULT false,
    "is2FA" BOOLEAN NOT NULL DEFAULT false,
    "creationTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTime" TIMESTAMP(3) NOT NULL,
    "matchPlayed" INTEGER NOT NULL DEFAULT 0,
    "nOfWins" INTEGER NOT NULL DEFAULT 0,
    "nOfLoss" INTEGER NOT NULL DEFAULT 0,
    "winRate" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userID")
);

-- CreateTable
CREATE TABLE "Games" (
    "gameID" TEXT NOT NULL,
    "player1ID" TEXT NOT NULL,
    "player2ID" TEXT NOT NULL,
    "winnerID" TEXT,
    "scoreP1" INTEGER NOT NULL DEFAULT 0,
    "scoreP2" INTEGER NOT NULL DEFAULT 0,
    "specialMode" BOOLEAN NOT NULL DEFAULT false,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Games_pkey" PRIMARY KEY ("gameID")
);

-- CreateTable
CREATE TABLE "Achievements" (
    "achievementID" TEXT NOT NULL,
    "userAID" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "achieved" BOOLEAN NOT NULL DEFAULT false,
    "prizeMin" INTEGER NOT NULL,
    "prizeImg" TEXT NOT NULL,
    "creationTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Achievements_pkey" PRIMARY KEY ("achievementID")
);

-- CreateTable
CREATE TABLE "RoomMembership" (
    "userID" TEXT NOT NULL,
    "roomID" TEXT NOT NULL,
    "role" "RoomRole" NOT NULL,
    "ismuted" BOOLEAN NOT NULL DEFAULT false,
    "muteend" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoomMembership_pkey" PRIMARY KEY ("roomID")
);

-- CreateTable
CREATE TABLE "Friendship" (
    "friendshipID" TEXT NOT NULL,
    "user1ID" TEXT NOT NULL,
    "user2ID" TEXT NOT NULL,
    "creationTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "friendshipStatus" "FriendshipStatus" NOT NULL,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("friendshipID")
);

-- CreateTable
CREATE TABLE "Requests" (
    "requestID" TEXT NOT NULL,
    "senderID" TEXT NOT NULL,
    "receiverID" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL,
    "type" "RequestType" NOT NULL,
    "ifGameType" "Mode" DEFAULT 'REGULAR',
    "creationTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Requests_pkey" PRIMARY KEY ("requestID")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "RoomType" NOT NULL,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sendId" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_memberin" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_banedin" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_secret2FA_key" ON "User"("secret2FA");

-- CreateIndex
CREATE UNIQUE INDEX "User_auth2FA_id_key" ON "User"("auth2FA_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_RTokens_key" ON "User"("RTokens");

-- CreateIndex
CREATE UNIQUE INDEX "RoomMembership_userID_key" ON "RoomMembership"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "_memberin_AB_unique" ON "_memberin"("A", "B");

-- CreateIndex
CREATE INDEX "_memberin_B_index" ON "_memberin"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_banedin_AB_unique" ON "_banedin"("A", "B");

-- CreateIndex
CREATE INDEX "_banedin_B_index" ON "_banedin"("B");

-- AddForeignKey
ALTER TABLE "Games" ADD CONSTRAINT "Games_player1ID_fkey" FOREIGN KEY ("player1ID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Games" ADD CONSTRAINT "Games_player2ID_fkey" FOREIGN KEY ("player2ID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievements" ADD CONSTRAINT "Achievements_userAID_fkey" FOREIGN KEY ("userAID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomMembership" ADD CONSTRAINT "RoomMembership_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomMembership" ADD CONSTRAINT "RoomMembership_roomID_fkey" FOREIGN KEY ("roomID") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_user1ID_fkey" FOREIGN KEY ("user1ID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_user2ID_fkey" FOREIGN KEY ("user2ID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_receiverID_fkey" FOREIGN KEY ("receiverID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_senderID_fkey" FOREIGN KEY ("senderID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_memberin" ADD CONSTRAINT "_memberin_A_fkey" FOREIGN KEY ("A") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_memberin" ADD CONSTRAINT "_memberin_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_banedin" ADD CONSTRAINT "_banedin_A_fkey" FOREIGN KEY ("A") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_banedin" ADD CONSTRAINT "_banedin_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("userID") ON DELETE CASCADE ON UPDATE CASCADE;
