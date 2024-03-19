import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from './chat.service';

@Controller()
@UseGuards(AuthGuard('jwt'))
export class ChatController {
    constructor (private readonly Prisma: PrismaService, private chat:ChatService){}

    @Get('all_mssg/:roomId')
    get_all_mssg(@Req() req, @Param('roomId') roomId: string){
        return this.chat.get_mssg(roomId, req.user.userID);
    }

    @Get('all_friends')
    get_all_friends(@Req() req){
        return this.chat.getFriends(req.user.userID);
    }

    @Get('all_rooms')
    get_all_rooms(@Req() req){
        return this.chat.getrooms(req.user.userID);
    }

}
