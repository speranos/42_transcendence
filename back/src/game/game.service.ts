import { ForbiddenException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Player } from './component';
import { TransformationType } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';
import { Mode } from '@prisma/client';

@Injectable()
export class GameService {
  constructor(private prisma : PrismaService){}
  private players: Player[] = [];
  setPlayer(player: Player) {
    this.players.push(player);
  }

  getPlayer(): Player[] {
    return this.players;
  }
  
  private socketId: string;
  setSocketIdcls(socketId: string) {
    this.socketId = socketId;
  }

  getSocketIdcls() {
    return this.socketId;
  }

  async sendRequest(userID : string, receiverId : string, specialMode? : boolean){
   try{
    let gameMode : Mode;
    const alreadyFriends = await this.prisma.friendship.findMany({
      where : {
        OR : [ {user1ID : userID, user2ID : receiverId}, {user1ID : receiverId, user2ID : userID}],
      }
    });
    if (!specialMode)
      gameMode = 'REGULAR';
    else
      gameMode = 'SUPER';
    if (!alreadyFriends)
      throw new UnauthorizedException('Cant Invite non-friend users to a game!');
    const Game = await this.prisma.games.create({
      data : {
        player1ID: userID,
        player2ID: receiverId,
        specialMode : specialMode,
      }
    });
    if (!Game)
      throw new UnauthorizedException('Database Malfunction');
    const request = await this.prisma.requests.create({
      data : {
        senderID : userID,
        receiverID : receiverId,
        status : 'PENDING',
        type : 'GAME',
        ifGameType : gameMode,
        ifGameID : Game.gameID,
      },
    });
    return Game.gameID;
   }
   catch(e){
   }
  }

  async acceptGRequest(requestid : string){
    let key : string;
    const request= await this.prisma.requests.update({
      where :{
        requestID : requestid,
      },
      data: {
        status : 'ACCEPTED',
      }
    });
    if (!request)
      throw new NotFoundException("Request not found");
    return request.ifGameID;
  }

  async declineGRequest(requestid : string){
    const request = await this.prisma.requests.update({
      where :{
        requestID : requestid,
      },
      data :{
        status : 'DENIED',
      }
    });
    if (!request)
      throw new NotFoundException("Request Not Found");
    await this.prisma.games.delete({
      where : {
        gameID : request.ifGameID,
      }
    });
    return ;
  }


}