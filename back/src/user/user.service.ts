import { ForbiddenException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { SrequestsDTO, auth42dto, requestsDTO, returnuserDTO, userDTO } from '../alldtos';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {

  constructor(private prisma : PrismaService){}


  async findOnebyID(userX : any):Promise<userDTO> {
    try{
      const user = await this.prisma.user.findUnique({
        where:{
          userID : userX.userID,
        } 
      });
      if (!user) throw new ForbiddenException("User not found");
      else{
          const dataResp = new userDTO()
          dataResp.userID = user.userID;
          dataResp.userName =  user.userName;
          if (!user.avatar.includes('cdn.intra'))
            dataResp.link = "http://localhost:3000" + user.avatar;
          else 
            dataResp.link = user.avatar;
          dataResp.is2FA = user.is2FA;
        return dataResp;
      }
    }
    catch(e){}
  }

  async enable2FA(user : userDTO){
    if (user.is2FA)
      throw new ForbiddenException("2FA is already enabled!");
    try{
      await this.prisma.user.update({
        where:{
          userID : user.userID,
        },
        data : {
          is2FA : true,
        },
      })
    }
    catch(e){
      throw new ForbiddenException("User not found");
    }
  }

  async disable2FA(user : userDTO){
    if (!user.is2FA)
      throw new ForbiddenException("2FA is already disabled!");
    try{
      await this.prisma.user.update({
        where:{
          userID : user.userID,
        },
        data : {
          is2FA : false,
        },
      })
    }
    catch(e){
      throw new ForbiddenException("User not found");
    }
  }

  async unChange(username : string, userID: string){
    if (!username || !userID)
      throw new UnauthorizedException("Bad Request");
    else{
      try{
        const existingID = await this.prisma.user.findUnique({
          where:{
            userName : username,
          },
        });
        if (existingID)
          throw new UnauthorizedException("Username already existing!")
        await this.prisma.user.update({
          where:{
            userID: userID
          },
        data :{
            userName : username,
        }});
      }
      catch(e){
        if (e.code === '2002'){
          throw new UnauthorizedException('Username already exists');
        }
        else{
          throw new ForbiddenException('Bad Request');
        }
      }
  }
}

  async avatarChange(ID : string, avatarr: Express.Multer.File){
    if (!ID ||!avatarr)
      throw new UnauthorizedException("Bad Request");
    let path = '/data/' + avatarr.filename;
    try{
      await this.prisma.user.update({
        where:{
          userID : ID,
        },
        data :{
          avatar : path,
        }});
      }
      catch(e){
        throw new ForbiddenException('Upload failed, please try again');
      }
  }

  // async listGRequests(userid : string){
  //   try{
  //     const requests = await this.prisma.requests.findMany({
  //       where: {
  //         receiverID : userid,
  //         type : "GAME",
  //         status : "PENDING",
  //       },
  //       select :{
  //         requestID : true,
  //         senderID : true,
  //         ifGameType : true,
  //         sender : {
  //           select :{
  //             userName : true,
  //             avatar : true,
  //           },
  //         },
  //       },
  //       orderBy : {
  //         creationTime : 'desc',
  //       },
  //     });
  //     const data = new Array<requestsDTO>;
  //     for(let i = 0; i != requests.length; i++){
  //       const infos = new requestsDTO();
  //       infos.requestID = requests[i].requestID;
  //       infos.senderID = requests[i].senderID;
  //       if (requests[i].ifGameType === 'REGULAR')
  //         infos.specialMode = false;
  //       else
  //         infos.specialMode = true;
  //       infos.senderUsername = requests[i].sender.userName;
  //       infos.senderavatar = requests[i].sender.avatar;
  //       data.push(infos);
  //     }
  //     return data;
  //   }
  //   catch(e){
  //     throw new ForbiddenException('Requests cant be read, please try again!');
  //   }
  // }

  // async listRequests(userid : string){
  //   try{
  //     const requests = await this.prisma.requests.findMany({
  //       where :{
  //         receiverID : userid,
  //         type : "FRIENDSHIP",
  //         status : "PENDING",
  //       },
  //       select:{
  //         requestID : true,
  //         senderID : true,
  //         sender : {
  //            select : {
  //              userName : true, 
  //              avatar : true,
  //            },
  //          },
  //       },
  //       orderBy : {
  //         creationTime : 'desc',
  //       },
  //     }); 
  //     const data = new Array<requestsDTO>;
  //     for(let i = 0; i != requests.length; i++){
  //       const infos = new requestsDTO();
  //       infos.requestID = requests[i].requestID;
  //       infos.senderID = requests[i].senderID;
  //       infos.senderUsername = requests[i].sender.userName;
  //       infos.senderavatar = requests[i].sender.avatar;
  //       data.push(infos);
  //     }
  //     return data;
  // }
  // catch(e){
  //   throw new ForbiddenException('Requests cant be read, please try again');
  // }
  // }
  async listGRequestsRecv(userid : string){
    try{
      const requests = await this.prisma.requests.findMany({
        where: {
          receiverID : userid,
          type : "GAME",
          status : "PENDING",
        },
        select :{
          requestID : true,
          senderID : true,
          ifGameType : true,
          sender : {
            select :{
              userName : true,
              avatar : true,
            },
          },
        },
        orderBy : {
          creationTime : 'desc',
        },
      });
      const data = new Array<requestsDTO>;
      for(let i = 0; i != requests.length; i++){
        const infos = new requestsDTO();
        infos.requestID = requests[i].requestID;
        infos.senderID = requests[i].senderID;
        if (requests[i].ifGameType === 'REGULAR')
          infos.specialMode = false;
        else
          infos.specialMode = true;
        infos.senderUsername = requests[i].sender.userName;
        infos.senderavatar = requests[i].sender.avatar;
        data.push(infos);
      }
      return data;
    }
    catch(e){
      throw new ForbiddenException('Requests cant be read, please try again!');
    }
  }

  async listRequestsRecv(userid : string){
    try{
      const requests = await this.prisma.requests.findMany({
        where :{
          receiverID : userid,
          type : "FRIENDSHIP",
          status : "PENDING",
        },
        select:{
          requestID : true,
          senderID : true,
          sender : {
             select : {
               userName : true, 
               avatar : true,
             },
           },
        },
        orderBy : {
          creationTime : 'desc',
        },
      }); 
      const data = new Array<requestsDTO>;
      for(let i = 0; i != requests.length; i++){
        const infos = new requestsDTO();
        infos.requestID = requests[i].requestID;
        infos.senderID = requests[i].senderID;
        infos.senderUsername = requests[i].sender.userName;
        infos.senderavatar = requests[i].sender.avatar;
        data.push(infos);
      }
      return data;
  }
  catch(e){
    throw new ForbiddenException('Requests cant be read, please try again');
  }
  }


  async listRequestsSent(userid : string){
    try{
      const requests = await this.prisma.requests.findMany({
        where :{
          senderID : userid,
          type : "FRIENDSHIP",
        },
        select:{
          requestID : true,
          receiverID : true,
          status: true,
          receiver : {
             select : {
               userName : true, 
               avatar : true,
             },
           },
        },
        orderBy : {
          creationTime : 'desc',
        },
      }); 
      const data = new Array<SrequestsDTO>;
      for(let i = 0; i != requests.length; i++){
        const infos = new SrequestsDTO();
        infos.requestID = requests[i].requestID;
        infos.senderID = requests[i].receiverID;
        infos.status = requests[i].status;
        infos.senderUsername = requests[i].receiver.userName;
        infos.senderavatar = requests[i].receiver.avatar;
        data.push(infos);
      }
      return data;
  }
  catch(e){
    throw new ForbiddenException('Requests cant be read, please try again');
  }
}

async listGRequestsSent(userid : string){
  try{
    const requests = await this.prisma.requests.findMany({
      where: {
        senderID : userid,
        type : "GAME",
      },
      select :{
        requestID : true,
        receiverID : true,
        ifGameType : true,
        status: true,
        receiver : {
          select :{
            userName : true,
            avatar : true,
          },
        },
      },
      orderBy : {
        creationTime : 'desc',
      },
    });
    const data = new Array<SrequestsDTO>;
    for(let i = 0; i != requests.length; i++){
      const infos = new SrequestsDTO();
      infos.requestID = requests[i].requestID;
      infos.senderID = requests[i].receiverID;
      infos.status = requests[i].status;
      if (requests[i].ifGameType === 'REGULAR')
        infos.specialMode = false;
      else
        infos.specialMode = true;
      infos.senderUsername = requests[i].receiver.userName;
      infos.senderavatar = requests[i].receiver.avatar;
      data.push(infos);
    }
    return data;
  }
  catch(e){
    throw new ForbiddenException('Requests cant be read, please try again!');
  }
}











}
  
  // async searchuserbyName(id : string ,username : string):Promise<returnuserDTO>{
  //   if (!username)
  //     throw new ForbiddenException('Bad Request');
  //   try{
  //     const user = this.prisma.user.findUnique({
  //       where :{
  //         userName : username,
  //       },
  //       select:{
    //       userID : true,
    //       userName : true,
    //       email : true,
    //       avatar : true,
    //       winRate : true,
    //   }
    // });
    // const achievements = this.prisma.achievements.findMany({
    //   where :{
    //     userAID : (await user).userID,
    //     achieved : true,
    //   },
    //   select : {
    //     Description : true,
    //     prizeImg : true,
    //     prizeMin : true,
    //   }
    // });
    // const userFriendships = this.prisma.friendship.findMany({
    //   where :{
    //     OR : [{
    //       user1ID : (await user).userID,  
    //     },{
    //       user2ID : (await user).userID,
    //     }], 
    //     friendshipStatus : 'FRIENDS'
    //   },
    // });
    // const userGames = this.prisma.games.findMany({
    //   take : 5,
  //     orderBy : {
  //       endTime : 'desc',
  //     },
  //     where : {
  //       OR  : [{
  //         player1ID : (await user).userID,
  //       }, {
  //         player2ID : (await user).userID,
  //       }],
  //     },
  //     select :{
  //       player1ID : true,
  //       player2ID : true,
  //       winnerID : true,
  //       scoreP1 : true,
  //       scoreP2 : true,
  //     },
  //   })
    
  // }
  // catch (e){
  //   throw new UnauthorizedException('User not found');
  // }
  // return;
  // }

  // async ownUserProfile(username : string, userid : string){
  //   let data : returnuserDTO;
  //   if (!userid || !username)
  //     throw new UnauthorizedException("Bad request");
  //   try{
  //     const userObject = await this.prisma.user.findUnique({
  //       where :{
  //         userName : username,
  //       },
  //       select:{
  //         userID : true,
  //         userName : true,
  //         email : true,
  //         avatar : true,
  //         winRate : true,
  //       }
  //     });
  //     if (userObject.userName !== username)
  //       throw new UnauthorizedException("Bad Request");
  //     data.IsBlocked = false;
  //     data.IsFriend = false;
  //     data.IsOwn = true;
  //     data.userID = userObject.userID;
  //     data.email = userObject.email;
  //     data.WinRate = userObject.winRate;
  //     data.username = userObject.userName;
      
  //   }
  //   catch(e){
  //     throw new UnauthorizedException(e);
  //   }
  // }
