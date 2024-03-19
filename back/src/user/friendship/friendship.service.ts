import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendshipService {
  constructor(private prisma: PrismaService) {}

  async sendFriendRequest(senderId: string, receiverId: string) {
    try{
      //("what");
      const existingRequests = await this.prisma.requests.findMany({
        where : {
          OR : [{senderID : senderId, receiverID :receiverId}, {senderID : receiverId, receiverID : senderId}],
          type : "FRIENDSHIP",
          status : "PENDING",
        }
      });
      //('ruuuu')
      const alreadyFriends = await this.prisma.friendship.findMany({
        where : {
          OR : [{user1ID : senderId, user2ID : receiverId}, {user2ID : senderId , user1ID: receiverId}],
        }
      });
      //("ll")
      if (existingRequests.length)
        throw new ForbiddenException('Request Already Sent');
      if (alreadyFriends.length)
        throw new ForbiddenException('You are already Friends');
      const reid = await this.prisma.requests.create({
          data: {
            senderID: senderId,
           receiverID: receiverId,
            status: 'PENDING',
            type: 'FRIENDSHIP',
          },
        });
        //(reid.requestID);
      return reid.requestID;
    }
    catch(e){}
  }
  
  async acceptFriendRequest(requestId: string) {
    const request = await this.prisma.requests.findUnique({ where: { requestID: requestId } });

    if (!request || request.status !== 'PENDING') {
      throw new NotFoundException('Friendship request not found or not pending');
    }

    await this.prisma.requests.update({
      where: { requestID: requestId },
      data: { status: 'ACCEPTED' },
    });

    const friends = await this.prisma.friendship.create({
      data: {
        user1ID: request.senderID,
        user2ID: request.receiverID,
        friendshipStatus: 'FRIENDS'
      },
    });
    const sender = await this.prisma.user.findUnique({where: {userID: request.senderID}});
    const dm = await this.prisma.room.create({
      data:{
        userId: request.receiverID,
        name: '',
        type: 'DM',
        members:{
          connect: [
          {userID: request.senderID},
          {userID: request.receiverID},
          ]
        },
      },
    });
    //(dm);

    return ;
  }
  
  async blockFriendShip(RuserId: string, userid: string) {
    const friendshipId = await this.prisma.friendship.findMany({
      where : {
        OR : [{user1ID : userid, user2ID : RuserId}, {user1ID : RuserId,user2ID : userid }],
        friendshipStatus : 'FRIENDS',
      },
      select :{
        friendshipID : true,
      }
    });
    const updateFriendShip = await this.prisma.friendship.update({
      where: {friendshipID: friendshipId[0].friendshipID},
      data: {friendshipStatus: 'BLOCKED'},
    });
    const blockedUser = await this.prisma.friendship.findUnique({
      where : {
        friendshipID : friendshipId[0].friendshipID,
      },
      select : {
        user1ID : true,
        user2ID : true,
      }
    });
    let blockedID;
    if (userid === blockedUser.user1ID)
      blockedID = blockedUser.user2ID;
    else
      blockedID = blockedUser.user1ID;
    const roomsIDs = await this.prisma.room.findMany({
      where :{
        type : 'DM',
      },
      select : {
        members : {
          where :{
            userID : blockedID,
          },
        },
        id : true,
      },
    });
    // console.log("ROOOOMS ======", roomsIDs);
    const roomid = roomsIDs[0].id;
    console.log("ARG[0]", roomid);
    await this.prisma.message.deleteMany({where: {roomId: roomid}});    
    await this.prisma.roomMembership.deleteMany({where: {roomID: roomid}});
    const act = await this.prisma.room.delete({where:{id: roomid}});
    // if(act)
    //   console.log("delete success");
    // else
    //   console.log("delete failed");
    return updateFriendShip;
  }

  async  DeclineRequest(requestId: string){
    await this.prisma.requests.delete({where: {requestID: requestId}});
    return 'HAAAA9 MCHAAAA!';
  }

  //liste
}
