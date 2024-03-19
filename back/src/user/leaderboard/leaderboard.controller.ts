import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseFilters } from '@nestjs/common';
import { LeaderBoardService } from './leaderboard.service';
import { AuthGuard } from '@nestjs/passport';
import { HttpExceptionFilter } from 'src/auth/exception.filter';

@UseGuards(AuthGuard('jwt'))
@Controller('leaderBoard')
@UseFilters(HttpExceptionFilter)
export class LeaderBoardController {
    constructor(private readonly LeaderBoardService : LeaderBoardService) {}

    @Get('data')
    getLeadearBoard(@Req() req){
        try {
        return this.LeaderBoardService.fetch_data(req.user.userID);
        }
        catch(e){}
    }
}
