import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Player, achievementsListDTO, blockedUsersList, friendsListDTO, matchHistoryListDTO, userProfileDTO } from 'src/alldtos';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class ProfileService {
  constructor(private readonly prisma : PrismaService){}

  async getBasicInfos(SuserID:string, Rusername:string){
    try{
      let isF : boolean;
      let isOwner : boolean;
      let isFR : boolean;
      let isBlocked: boolean;
      const Ruser = await this.prisma.user.findUnique({
        where : {
          userID : Rusername,
        },
        select : {
          userID : true,
          userName : true,
          email : true,
          avatar : true,
          winRate : true,
          userInGame : true,
          userOnline : true,
        },
      });
      if (!Ruser)
        throw new ForbiddenException('User not found');
      const areFriends  = await this.prisma.friendship.findMany({
        where : {
          OR : [{user1ID : Ruser.userID, user2ID : SuserID}, {user1ID : SuserID, user2ID : Ruser.userID}],
        },
        select : {
          friendshipID : true,
          friendshipStatus : true,
        }
      });
      if (!areFriends.length){
        if (SuserID === Ruser.userID){
        isOwner = true;
        isF = false;
        isFR = false;
        }
      else{
          const fRequests = await this.prisma.requests.findMany({
            where : {
              OR : [{senderID : Ruser.userID, receiverID : SuserID}, {senderID : SuserID, receiverID : Ruser.userID}],
              status : 'PENDING',
            },
          });
          if (!fRequests.length){
            isFR = false;
            isF = false;
          }
          else{
            isFR = true;
            isF = false;
          }
        }
    }
    else{
      if(areFriends[0].friendshipStatus === 'BLOCKED'){
        isBlocked = true;
        throw new UnauthorizedException('User Blocked');
        }
        else
          isF = true;
      }
      const data : userProfileDTO = new userProfileDTO();
      data.userID = Ruser.userID;
      data.userName = Ruser.userName;
      data.userEmail = Ruser.email;
      if (!Ruser.avatar.includes('cdn.intra'))
        data.userAvatar = "http://localhost:3000" + Ruser.avatar;
      else 
        data.userAvatar = Ruser.avatar;
      if(!(Ruser.winRate % 2))
       data.WinRate = Ruser.winRate.toString() + '%';
      else
        data.WinRate = Ruser.winRate.toFixed(2) + '%';
      data.isInGame = Ruser.userInGame;
      data.isOnline = Ruser.userOnline;
      data.isOwner = isOwner;
      data.isFriend = isF;
      data.isFriendReq = isFR;
      //("0000->",data);
      return data;
    }
    catch(e){}
  }

  async getMatchH(Rusername : string) : Promise<matchHistoryListDTO[] | null>{
    try{
      const Ruser = await this.prisma.user.findUnique({where : {userID : Rusername}, select: {userID : true}});
      const games = await this.prisma.games.findMany({
        where : {
          OR : [{player1ID : Ruser.userID}, {player2ID : Ruser.userID}]
        },
        select : {
          gameID : true,
          player1ID : true,
          player2ID : true,
          winnerID : true,
          scoreP1 : true,
          scoreP2 : true,
          specialMode : true,
          P1 : {
            select : {
              userID : true,
              userName : true,
              avatar : true,
            }
          },
          P2 : {
              select : {
              userID : true,
              userName : true,
              avatar : true,
            }
          },
        },
        orderBy:{
          endTime : 'desc'
        },
       take : 5
      });
      if (!games)
        return null;
      const data = new Array<matchHistoryListDTO>;
      for(let i = 0; i != games.length; i++){
        const info = new matchHistoryListDTO();
        const infoPlayer1 = new Player();
        const infoPlayer2 = new Player();
        info.player1 = infoPlayer1;
        info.player2 = infoPlayer2;
        info.gameID = games[i].gameID;
        info.WinnerID = games[i].winnerID;
        info.specialMode = games[i].specialMode;
        info.player1.playerID = games[i].P1.userID;
        if (!games[i].P1.avatar.includes('cdn.intra'))
          info.player1.playerAvatar = "http://localhost:3000" + games[i].P1.avatar;
        else 
          info.player1.playerAvatar = games[i].P1.avatar;
        info.player1.playerUsername = games[i].P1.userName;
        info.player1.Score = games[i].scoreP1;
        info.player2.playerID = games[i].P2.userID;
        if (!games[i].P2.avatar.includes('cdn.intra'))
          info.player2.playerAvatar = "http://localhost:3000" + games[i].P2.avatar;
        else 
          info.player2.playerAvatar = games[i].P2.avatar;
        info.player2.playerUsername = games[i].P2.userName;
        info.player2.Score = games[i].scoreP2;
        data.push(info);
      }
      //(data);
      return data;
  }
    catch(e){}
  }

  async getfriendsL(Rusername : string) : Promise<friendsListDTO[] | null>{
    try{
      const Ruser = await this.prisma.user.findUnique({where : { userID : Rusername}, select :{userID : true}});
      const friends = await this.prisma.friendship.findMany({
        where : {
          OR : [{user1ID : Ruser.userID}, {user2ID : Ruser.userID}],
          friendshipStatus : 'FRIENDS',
        },
      });
      if (!friends.length)
        return null;
      const filter = friends.map((friends)=>{
          if(friends.user1ID === Ruser.userID)
            return friends.user2ID;
          else
            return friends.user1ID;
      })
      const data = new Array<friendsListDTO>;
      for(let i = 0; i != filter.length; i++){
        const info = new friendsListDTO();
        const Fuser = await this.prisma.user.findUnique({
          where :{
            userID : filter[i],
          },
          select :{
            userID : true,
            avatar : true,
            userName : true,
            userInGame : true,
            userOnline : true,
          },
        });
        info.userID = Fuser.userID;
        info.userName = Fuser.userName;
        if (!Fuser.avatar.includes('cdn.intra'))
          info.userAvatar = "http://localhost:3000" + Fuser.avatar;
        else 
          info.userAvatar = Fuser.avatar;
        info.isOnline = Fuser.userOnline;
        info.isInGame = Fuser.userInGame;
        data.push(info);
      }
      return data;
    }
    catch(e){}
  }

  async getachievementsL(Rusername : string): Promise<achievementsListDTO[] | null>{
    try{
      const Ruser = await this.prisma.user.findUnique({where :{userID : Rusername}, select:{userID : true, matchPlayed : true,}});
      if (!Ruser)
        throw new UnauthorizedException('User not found');
      const achievements = await this.prisma.achievements.findMany({
        where : {
          userAID : Ruser.userID,
        },
        select :{
          achievementID : true,
          Description : true,
          prizeMin : true,
          prizeImg : true,
          updateAt : true,
        },
        orderBy:{
          prizeMin : 'asc', 
        },
      });
      if (!achievements)
        return null;
      const data = new Array<achievementsListDTO>;
      for (let i = 0; i!= achievements.length; i++){
        if (achievements[i].prizeMin <= Ruser.matchPlayed){
          const info = new achievementsListDTO();
          info.userID = Ruser.userID;
          info.achievementID = achievements[i].achievementID;
          info.description = achievements[i].Description;
          info.prizeImg = "http://localhost:3000" + achievements[i].prizeImg;
          info.time = achievements[i].updateAt;
          data.push(info);
        }
        else
          continue;
      }
      if (data.length)
        return data;
      else
        return null;
    }
    catch(e){}
  }
  
  async unFriend(SuserID : string, RuserID : string){
    try{
      const friendshipx = await this.prisma.friendship.findMany({
        where :{
          OR : [{user1ID : SuserID, user2ID : RuserID}, {user1ID : RuserID, user2ID : SuserID}],
          friendshipStatus : 'FRIENDS',
        },
        select: {
          friendshipID : true,
        }
      });
      if (friendshipx.length > 1)
        throw new ForbiddenException("Database Problem");
      const deleted  = await this.prisma.friendship.delete({
        where : {
          friendshipID : friendshipx[0].friendshipID,
        },
      });
      const roomsIDs = await this.prisma.room.findMany({
        where :{
          type : 'DM',
        },
        select : {
          members : {
            where :{
              userID : RuserID,
            },
          },
          id : true,
        },
      });
      // console.log("ROOOOMS ======", roomsIDs);
      const roomid = roomsIDs[0].id;
      await this.prisma.message.deleteMany({where: {roomId: roomid}});    
      await this.prisma.roomMembership.deleteMany({where: {roomID: roomid}});
      const act = await this.prisma.room.delete({where:{id: roomid}});

      if (!friendshipx.length)
        return true;
      return 
        false;
    }
    catch(e){
    }
  }

  async unBlock(SuserID : string, RuserID : string){
    try{
      const friendshipx = await this.prisma.friendship.findMany({
        where :{
          OR : [{user1ID : SuserID, user2ID : RuserID}, {user1ID : RuserID, user2ID : SuserID}],
          friendshipStatus : 'BLOCKED',
        },
        select: {
          friendshipID : true,
        }
      });
      if (friendshipx.length > 1)
        throw new ForbiddenException("Database Problem");
      const unBlocked = await this.prisma.friendship.update({
        where : {
          friendshipID : friendshipx[0].friendshipID,
        },
        data: {
          friendshipStatus : 'FRIENDS',
        },
      });
      // const sender = await this.prisma.user.findUnique({where: {userID: request.senderID}});
      const dm = await this.prisma.room.create({
        data:{
          userId: RuserID,
          name: '',
          type: 'DM',
          members:{
            connect: [
            {userID: SuserID},
            {userID: RuserID},
            ]
          },
        },
      });
      //(dm);
      if (unBlocked)
        return true;
      else
        return false;
    }
    catch(e){}
  }

  async listBlocked(userID : string): Promise<blockedUsersList[]|null>{
    try{
      const BlockedUsers = await this.prisma.friendship.findMany({
        where:{
          OR : [{user1ID : userID}, {user2ID : userID}],
          friendshipStatus : 'BLOCKED',
        },
        select : {
          user1 : {
            select:{
              userID : true,
              avatar : true,
              userName : true,
            }
          },
          user2 : {
            select:{
              userID: true,
              avatar: true,
              userName: true,
            }
          }
        }
      });
      if (!BlockedUsers.length)
        return null;
      const filter = BlockedUsers.map((friends)=>{
        if(friends.user1.userID === userID)
          return friends.user2;
        else
          return friends.user1;
      });
      const Data = new Array<blockedUsersList>
      for(let i = 0; i != filter.length; i++){
        const info = new blockedUsersList();
        info.userID = filter[i].userID;
        info.userName = filter[i].userName;
        if (!filter[i].avatar.includes('cdn.intra'))
          info.avatar = "http://localhost:3000" + filter[i].avatar;
        else
          info.avatar = filter[i].avatar;
        Data.push(info);
      }
      //(Data);
      return Data;
    }
    catch(e){}
  }
}
