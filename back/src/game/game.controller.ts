import { Controller, Get, Logger, Req, Res, UseGuards, Post, Param, UnauthorizedException, Body, HttpException, HttpStatus, UseFilters } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GameService } from './game.service';
import { Player } from './component';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransformationType } from 'class-transformer';
import { HttpExceptionFilter } from 'src/auth/exception.filter';
@Controller('')
@UseGuards(AuthGuard('jwt'))
@UseFilters(HttpExceptionFilter)
export class GameController{

  constructor(private readonly gameService: GameService, private readonly prisma:PrismaService) {} 
  @Get('classic') 
  async getRoot(@Req() req, @Res() res) {
    try{
      let player = new Player();
      player.playerid = req.user.userID;
      player.playername = req.user.userName;
      const user = await this.prisma.user.findUnique({where:{
        userID : req.user.userID,
      }})
      player.ingame = user.userInGame;
      player.iswait = user.userWaiting;
      if (!user.avatar.includes('cdn.intra'))
        player.playeravatar = "http://localhost:3000" + user.avatar;
      else
        player.playeravatar = user.avatar;
      player.matchplayed = user.matchPlayed;
      player.nofloss = user.nOfLoss;
      player.nofwins = user.nOfWins;
      this.gameService.setPlayer(player);
      res.send("Player data set successfully");
      return (res);
    }
    catch(e){}
  }

  @Get('wtf')
  async getwtf(@Req() req, @Res() res) {
    try{
      let player = new Player();
      player.playerid = req.user.userID;
      player.playername = req.user.userName;
      const user = await this.prisma.user.findUnique({
        where: { userID: req.user.userID },
      });
      player.ingame = user.userInGame;
      player.iswait = user.userWaiting;
      if (!user.avatar.includes('cdn.intra'))
        player.playeravatar = "http://localhost:3000" + user.avatar;
      else
        player.playeravatar = user.avatar;
      player.matchplayed = user.matchPlayed;
      player.nofloss = user.nOfLoss;
      player.nofwins = user.nOfWins;
      this.gameService.setPlayer(player);
      res.json([player]);
      }
      catch(e){}
  }

  @Post('game/send-request/:receiverID')
  async sendGameRequest(@Req() req, @Param('receiverID') receiverID: string, @Body('specialMode') Mode : boolean){
    try{
      if (!receiverID || !req.user)
        throw new UnauthorizedException('Bad Request');
      return this.gameService.sendRequest(req.user.userID, receiverID, Mode);
    }
    catch(e){
      throw new HttpException(e, HttpStatus.FORBIDDEN);
    }
  }

  @Post('game/accept-request/:requestid')
  async acceptGameRequest(@Req() req, @Param('requestid') requestID : string){
    try{
      if (!req.user || !requestID){
        throw new UnauthorizedException('Bad Request');
      }
      return await this.gameService.acceptGRequest(requestID);
    }
    catch(e){
      throw new HttpException(e, HttpStatus.FORBIDDEN);
    }
  }

  @Post('game/decline-request/:requestid')
  async declineGameRequest(@Req() req, @Param('requestid') requestID : string){
    try{
      if (!req.user || !requestID)
        throw new UnauthorizedException('Bad Request');
      return await this.gameService.declineGRequest(requestID);
    }
    catch(e){
      throw new HttpException(e, HttpStatus.FORBIDDEN);
    }
  }


}