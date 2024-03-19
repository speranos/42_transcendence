import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { FriendshipController } from './friendship/friendship.controller';
import { LeaderBoardController } from './leaderboard/leaderboard.controller';
import { FriendshipService } from './friendship/friendship.service';
import { LeaderBoardService } from './leaderboard/leaderboard.service';
import { ChatService } from 'src/chat/chat.service';
import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';

@Module({
  controllers: [UserController, FriendshipController, LeaderBoardController, ProfileController],
  providers: [UserService, PrismaService, FriendshipService, LeaderBoardService, ChatService, ProfileService],
  imports: [],
})
export class UserModule {}
