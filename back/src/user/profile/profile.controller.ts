import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UnauthorizedException, HttpException, HttpStatus, UseFilters } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from '@nestjs/passport';
import { TransformationType } from 'class-transformer';
import { HttpExceptionFilter } from 'src/auth/exception.filter';

@Controller('profile')
@UseGuards(AuthGuard('jwt'))
@UseFilters(HttpExceptionFilter)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('data/:userID')
  async getbasicinfos(@Req() req, @Param('userID') username : string){
    try{
      if (!req.user || !username)
        throw new UnauthorizedException('Bad Request');
      return await this.profileService.getBasicInfos(req.user.userID, username);
    }
    catch(e){
      throw new HttpException(e, HttpStatus.FORBIDDEN);
    }
  }
  @Get('matchhistory/:userID')
  async getmatchhistory(@Req() req, @Param('userID') username: string){
    try{
      //("baaaa3");
      if (!req.user || !username)
        throw new UnauthorizedException('Bad Request');
      return await this.profileService.getMatchH(username);
    }
    catch(e){
      throw new HttpException(e, HttpStatus.FORBIDDEN);
    }
  }
  @Get('friendslist/:userID')
  async getfriendslist(@Req() req, @Param('userID') username: string){
    try{
      if (!req.user || !username)
        throw new UnauthorizedException('Bad Request');
      return await this.profileService.getfriendsL(username);
    }
    catch(e){
      throw new HttpException(e, HttpStatus.FORBIDDEN);
    }
  }
  @Get('achievements/:userID')
  async getachievmentslist(@Req() req, @Param('userID') username : string){
    try{
      if (!req.user || !username)
        throw new UnauthorizedException('Bad Request');
      return await this.profileService.getachievementsL(req.user.userID);
    }
    catch(e){
      throw new HttpException(e, HttpStatus.FORBIDDEN);
    }
  }
  @Post('deletefriend/:userID')
  async deleteFriend(@Req() req, @Param('userID') userid : string){
    try{
      if (!req.user || !userid)
        throw new UnauthorizedException('Bad Request')
      return await this.profileService.unFriend(req.user.userID, userid);
    }
    catch(e){}
  }
  @Post('unblockfriend/:userID')
  async unblockFriend(@Req() req, @Param('userID') userid : string){
    try{
      if(!req.user || !userid)
        throw new UnauthorizedException('Bad Request');
      return await this.profileService.unBlock(req.user.userID, userid);
    }
    catch(e){}
  }
  @Get('blockedfriends')
  async BlockedUsers(@Req() req){
    try{
      if (!req.user)
        throw new UnauthorizedException("Bad Request");
      //('jesus');
      return await this.profileService.listBlocked(req.user.userID);
    }
    catch(e){

    }
  }
}
