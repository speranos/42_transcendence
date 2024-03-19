import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UseGuards, ForbiddenException, HttpException, HttpStatus, UnauthorizedException, UploadedFile, UseInterceptors, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { returnuserDTO, userDTO } from '../alldtos';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './multer';
import { HttpExceptionFilter } from 'src/auth/exception.filter';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
@UseFilters(HttpExceptionFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async userData(@Req() req): Promise<userDTO> {
    let userinfo : userDTO = await this.userService.findOnebyID(req.user);
    return userinfo;
  }

  @Post('settings/Enable2FA')
  async enableTwoFA(@Req() req, @Res() res){
    try{
      if (!req.user)
        throw new ForbiddenException("User not found");
      await this.userService.enable2FA(req.user);
      return ;
    }
    catch(e){
      throw new HttpException(e, HttpStatus.FORBIDDEN)
    }
  }

  @Post('settings/Disable2FA')
  async disableTwoFA(@Req() req, @Res() res){
    try{
      if (!req.user)
        throw new ForbiddenException("User not found");
      await this.userService.disable2FA(req.user);
      return res.send({message: "2FA disabled"});
    }
    catch(e){
      throw new HttpException(e, HttpStatus.FORBIDDEN)
    }
  }

    @Post('settings/changeUsername')
    async usernameChange(@Req() req, @Body('username') username){
      try {
        if (!req.user)
          throw new ForbiddenException("Bad Request");
        if (!username)
          throw new ForbiddenException("Empty Username!");
        return this.userService.unChange(username, req.user.userID)
      }
      catch(e){
        throw new HttpException(e, HttpStatus.FORBIDDEN);
      }
    }

    @Post('settings/changeAvatar')
    @UseInterceptors(FileInterceptor('avatar', multerConfig)) 
    async avatarChange(@Req() req, @UploadedFile() avatar: Express.Multer.File){
      try {
        if (!req.user || !avatar)
          throw new ForbiddenException('Bad Request');
        return this.userService.avatarChange(req.user.userID, avatar);
      }
      catch(e){
        throw new HttpException(e, HttpStatus.FORBIDDEN);
      }
    }

    @Get('requests/friendship/recv')
    async listAllRequestsRecv(@Req() req){
      try{
        if(!req.user)
          throw new ForbiddenException('Bad Request');
        return this.userService.listRequestsRecv(req.user.userID);
      }
      catch(e){
        throw new HttpException(e, HttpStatus.FORBIDDEN);
      }
    }

    @Get('requests/friendship/sent')
    async listAllRequestsSent(@Req() req){
      try{
        if(!req.user)
          throw new ForbiddenException('Bad Request');
        return this.userService.listRequestsSent(req.user.userID);
      }
      catch(e){
        throw new HttpException(e, HttpStatus.FORBIDDEN);
      }
    }

    @Get('requests/game/recv')
    async listAllGRequestsRecv(@Req() req){
      try{
        if (!req.user)
          throw new ForbiddenException('Bad Request');
        return this.userService.listGRequestsRecv(req.user.userID);
      }
      catch(e){
        throw new HttpException(e, HttpStatus.FORBIDDEN);
      }
    }

    @Get('requests/game/sent')
    async listAllGRequestsSent(@Req() req){
      try{
        if (!req.user)
          throw new ForbiddenException('Bad Request');
        return this.userService.listGRequestsSent(req.user.userID);
      }
      catch(e){
        throw new HttpException(e, HttpStatus.FORBIDDEN);
      }
    }

    // @Get('requests/friendship')
    // async listAllRequests(@Req() req){
    //   try{
    //     if(!req.user)
    //       throw new ForbiddenException('Bad Request');
    //     return this.userService.listRequests(req.user.userID);
    //   }
    //   catch(e){
    //   }
    // }

    // @Get('requests/game')
    // async listAllGRequests(@Req() req){
    //   try{
    //     if (!req.user)
    //       throw new ForbiddenException('Bad Request');
    //     return this.userService.listGRequests(req.user.userID);
    //   }
    //   catch(e){
    //   }
    // }
    // @Get('profile/search/:user')
    // async searchuserbyname(@Param('user') user, @Req() req){
    //   try{
    //     const returnuser : returnuserDTO = await this.userService.searchuserbyName(req.user.userID, username);
    //   }
    //   catch(e){
    //     throw new HttpException(e, HttpStatus.FORBIDDEN);
    //   }
    // }

    // @Get('profile/:username')
    // async OwnUserProfile(@Param() username, @Req() req, @Res() res){
    //   try{
    //     const data : returnuserDTO = await this.ownUserProfile(username, req.user.userID);
    //     return data;
    //   }
    //   catch(e){
    //     throw new HttpException(e, HttpStatus.FORBIDDEN);
    //   }
    // }

}

