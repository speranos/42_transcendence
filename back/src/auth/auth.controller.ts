import { Body ,Controller, Post, Get, UseGuards, Req, Res, HttpCode, HttpStatus, UnauthorizedException, HttpException, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { FourTwoAuthGuard } from './AuthGuards/42AuthGuard';
import { Public } from './decorators/public.decorator'
import { FourTwoStrategy } from './42Strategy/42Strategy';
import { ConfigService } from '@nestjs/config';
import { auth42dto, userDTO } from '../alldtos';
import { Token } from './Token.types';
import { PrismaService} from '../prisma/prisma.service'
import { config } from 'process';
import { toFileStream } from 'qrcode';
import { TwoFactorService } from './two-factor/two-factor.service';
import {ApiBody} from '@nestjs/swagger'
import { HttpExceptionFilter } from './exception.filter';

@Controller("auth")
@UseFilters(HttpExceptionFilter)
export class AuthController {
    constructor(private authService: AuthService, private prisma: PrismaService, private config: ConfigService, private TwoFactor : TwoFactorService){}
    @Public()
    @Get()
    @UseGuards(AuthGuard('42'))
    async forty(){}

    @Public()
    @UseGuards(AuthGuard('42'))
    @Get('accept')
    async logUser(@Req() req, @Res() res){
        try{
            let token = null;
            const newData = new auth42dto();
            newData.email = req.user['email'];
            newData.link = req.user['link'];
            newData.userName = req.user['userName'];
            let checker : boolean = await this.authService.userChecker(newData.email, newData.userName);
            if (!checker){
                token = await this.authService.createNewUser(newData);
            }
            else{
                token = await this.authService.userLogIn(newData);
            }
            res.cookie('AToken', token.AToken, {httpOnly: true});
            res.cookie('RToken', token.RToken, {httpOnly: true});
            if (token.first_log){
                res.cookie('userLoggedIn', true);
                res.redirect("http://localhost:3001/Setup");
            }
            else if (!token.first_log){
                if (!token.is2FA){
                    res.cookie('userLoggedIn', true);
                    res.redirect("http://localhost:3001/Landing");
            }
            else{
                res.cookie('userLoggedIn', false);
                res.redirect("http://localhost:3001/2FA");
            }
        }
            res.complete;
            return res;
        }
        catch(e){
            throw new HttpException(e, HttpStatus.FORBIDDEN);
        } 
    }

    @Get('disconnect')
    @UseGuards(AuthGuard('jwt'))
    logUserOut(@Req() req, @Res() res){
        try{
            let user = req.user;
            this.authService.userLogOut(user.userID);
            res.clearCookie('AToken');
            res.clearCookie('RToken');
            res.cookie('userLoggedIn', false);
            res.send({message : "User Logged Out"});
            res.complete;
        }
        catch(e){}
    }

    @Get('refresh')
    @UseGuards(AuthGuard('jwtRefresh'))
    @HttpCode(HttpStatus.OK)
    async refreshSession(@Req() req, @Res() res){
        let token : Token = null;
        res.clearCookie('AToken');
        res.clearCookie('RToken');
        token = await this.authService.refreshSessionTokens(req.user.userID, req.cookies.RToken);
        res.cookie("AToken", token.AToken, {httpOnly: true, secure: true,});
        res.cookie("RToken", token.RToken,{httpOnly: true, secure: true,});
        res.send({message :"Tokens Refreshed"});
        res.complete;
    }

    @Get('generate2FA')
    @UseGuards(AuthGuard('jwt'))
    async   generate(@Req() req, @Res() res){
       if (!req.user.is2FA)
            throw new HttpException("2FA not enabled", HttpStatus.FORBIDDEN);
        const secret = await this.TwoFactor.generatePrivateCode(req.user);
        return toFileStream(res, secret);
    }

    @Post('verify2FA')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(200)
    async checkCode(@Body('code') code : string, @Res() res, @Req() req){
        if (!req.user.is2FA)
            throw new HttpException("2FA is not activated", HttpStatus.FORBIDDEN);
        const user : userDTO = req.user;
        const codeValidity = await this.authService.TwoFAVerification(user, code);
        res.clearCookie('AToken');
        res.clearCookie('RToken');
        res.cookie('AToken', codeValidity.AToken, {httpOnly: true});
        res.cookie('RToken', codeValidity.RToken, {httpOnly: true});
        if(codeValidity.authdone){
            res.cookie('userLoggedIn', true);
            return res.json({ success: true });
        }
        else{
            res.cookie('userLoggedIn', false);
            throw new HttpException("Incorrect code", HttpStatus.FORBIDDEN);
        } 
    }

}
