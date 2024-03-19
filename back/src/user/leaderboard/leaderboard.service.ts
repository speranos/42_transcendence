// import { Injectable } from '@nestjs/common';
import { leaderBoardDto } from '../../alldtos';
import { PrismaService } from 'src/prisma/prisma.service';

// @Injectable()
// export class LeaderBoardService {
//     constructor (private readonly Prisma : PrismaService) {}
//     async fetch_data(){
//         const SetOfBoard = new Set<leaderBoardDto>();
//         const users = await this.Prisma.user.findMany({
//             select: {
//                 userID: true,
//                 userName: true,
//                 avatar: true,
//                 winRate: true
//             },
//             orderBy: {
//                 winRate: 'desc'
//             }
//         });

//         var i = 0;
//         while (i < users.length){
// //             const leaderBoard = new leaderBoardDto();
// //             // //("------------------", users[i].userID);
// //             leaderBoard.id = users[i].userID;
//             leaderBoard.userName = users[i].userName;
//             leaderBoard.avatar = users[i].avatar;
//             leaderBoard.winrate =  users[i].winRate;
//             leaderBoard.rank = i;
//             SetOfBoard.add(leaderBoard);
//             i++;
//         }

//         // SetOfBoard.forEach(function(value) {
//         //     //(value);
//         //   });

//         // return;
//         const leaderboardArray = Array.from(SetOfBoard);
//         return leaderboardArray;
//         // return SetOfBoard;
//     }
// }


import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { ChatService } from 'src/chat/chat.service';

@Injectable()
export class LeaderBoardService {
    constructor (private readonly prisma: PrismaService, private chatserv: ChatService) {}

    async getBlockedUserIDs(userID: string): Promise<string[]> {
        const friendships = await this.prisma.friendship.findMany({
            where: {
                OR: [
                    { user1ID: userID },
                    { user2ID: userID }
                ],
                friendshipStatus: 'BLOCKED'
            }
        });
    
        const blockedUserIDs = friendships.map(friendship => {
            if (friendship.user1ID === userID) {
                return friendship.user2ID;
            } else {
                return friendship.user1ID;
            }
        });

        return blockedUserIDs;
    }

    async getFriends(userId: string): Promise<string[]> {

        const friends = await this.prisma.friendship.findMany({
            where: {
                OR: [
                    { user1ID: userId},
                    { user2ID: userId},
                ],
                friendshipStatus: 'FRIENDS',
            }
        });

        const filter = friends.map((friends) => {
            if(friends.user1ID === userId)
                return friends.user2ID;
            else
                return friends.user1ID;
        })
        return filter;
    }

    async fetch_data(userId: string){
        //const userId =  'user1'
        const SetOfBoard = new Set<leaderBoardDto>();
        const users = await this.prisma.user.findMany({
            select: {
                userID : true,
                userName: true,
                avatar: true,
                winRate: true,
                userOnline: true,
                userInGame : true,
            },
            orderBy: {
                winRate: 'desc'
            }
        });
        const blockedUserIDs = await this.getBlockedUserIDs(userId);
        const usersWithoutBlocked = users.filter(user => !blockedUserIDs.includes(user.userID));
        const friends = await this.getFriends(userId);
        var i = 0;
        while (i < usersWithoutBlocked.length){
            const leaderBoard = new leaderBoardDto();
            if(usersWithoutBlocked[i].userID === userId)
                leaderBoard.isOwner = true;
            if(friends.includes(usersWithoutBlocked[i].userID))
                leaderBoard.isFriend = true;
            leaderBoard.id = users[i].userID;
            leaderBoard.userName = usersWithoutBlocked[i].userName;
            if (!usersWithoutBlocked[i].avatar.includes('cdn.intra'))
                leaderBoard.avatar = "http://localhost:3000" + usersWithoutBlocked[i].avatar;
            else
                leaderBoard.avatar = usersWithoutBlocked[i].avatar;
            if(!(usersWithoutBlocked[i].winRate % 2))
                leaderBoard.winrate =  usersWithoutBlocked[i].winRate.toString() + '%';
            else
                leaderBoard.winrate =  usersWithoutBlocked[i].winRate.toFixed(2) + '%';
            leaderBoard.isOnline = usersWithoutBlocked[i].userOnline;
            leaderBoard.isInGame = usersWithoutBlocked[i].userInGame;
            leaderBoard.rank = ++i;
            //(leaderBoard);
            SetOfBoard.add(leaderBoard);
            // i++;
        }

        const leaderboardArray = Array.from(SetOfBoard);
        return leaderboardArray;

        // return SetOfBoard;
    }
}