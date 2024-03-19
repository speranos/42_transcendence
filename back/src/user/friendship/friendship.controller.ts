import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseFilters } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { AuthGuard } from '@nestjs/passport';
import { HttpExceptionFilter } from 'src/auth/exception.filter';

@Controller('friendship')
@UseGuards(AuthGuard('jwt'))
@UseFilters(HttpExceptionFilter)
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post('send-request/:receiverId')
  sendFriendRequest(@Req() req, @Param('receiverId') receiverId: string) {
    // const senderIdNumber = parseInt(senderId, 10);
    // const receiverIdNumber = parseInt(receiverId, 10);
    // //("*****>", this.friendshipService.sendFriendRequest(req.user.userID, receiverId));
    //('here -->>')
    return this.friendshipService.sendFriendRequest(req.user.userID, receiverId);
  }

  @Post('accept-request/:requestId') //khsha tbdl
  acceptFriendRequest(@Param('requestId') requestId: string) {
   return  this.friendshipService.acceptFriendRequest(requestId);
  }
// userid
  @Post('blockfriendship/:userId') // check for username
  blockFriendShip(@Req() req, @Param('userId') userId: string){
    return this.friendshipService.blockFriendShip(userId, req.user.userID);
  }

  @Post('decline-request/:requestId')
    DeclineRequest(@Param('requestId') requestId: string) {
      return this.friendshipService.DeclineRequest(requestId);
    }

  //note: more api to be added here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

}
