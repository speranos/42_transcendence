import { Injectable, Req, UnauthorizedException, Res, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { auth42dto, userDTO } from '../alldtos';
import { Token } from "./Token.types"
import { ConfigService } from '@nestjs/config';
import * as crypt from 'bcrypt'
import { authenticator } from 'otplib';

@Injectable()
export class AuthService {
    constructor( private prisma: PrismaService, private jwt: JwtService, private config: ConfigService){}
    signUp(){}
    signIn(){}
    async createNewUser(newData: auth42dto){
        let first_log = true;
        const existingUser = await this.prisma.user.findUnique({
            where :{
                userName : newData.userName,
            },
            select:{
                userName : true,
            },
        });
        if (existingUser)
            newData.userName = existingUser.userName + '_'
        const newUser = this.prisma.user.create({
            data: { 
                userName : newData.userName,
                email    : newData.email,
                avatar   : newData.link,
                Achievements : {
                    create :[{
                            Description : "Mrhba bik!", prizeImg : '/data/prizeimg/batman1.svg', prizeMin: 1,
                    },{
                            Description : "stp, akher project!", prizeImg : "/data/prizeimg/batman2.svg", prizeMin: 2,
                    },{
                            Description : "Aw akhayy ma3yyitish ?", prizeImg : "/data/prizeimg/batman3.svg", prizeMin : 4,
                    }]
                }
            },
        });
        newData.ID = (await newUser).userID;
        const allToken = this.TokenGenerator(newData.ID, false, false);
        const HToken = await this.HTokenGenerator(allToken.RToken);
        await this.prisma.user.update({
            where :{
                userID : newData.ID,
                email : newData.email,
            },
            data:{
                RTokens : HToken,
                userOnline : true,
            }
        })
        return {...allToken,
            is2FA : false,
            first_log,
        };
    }
    async userLogIn(newData: auth42dto){
        let first_log = false;
        const logInUser = this.prisma.user.findUnique({
            where : {
                email : newData.email,
            },
        });
        if (!logInUser)
            throw new UnauthorizedException("Apologies! Seems like we have lost track of who you are, Please SignUp again");
        newData.ID = (await logInUser).userID;
        const is2FA = (await logInUser).is2FA;
        let allToken : Token;
        if (!is2FA)
            allToken =  this.TokenGenerator(newData.ID, (await logInUser).is2FA, true);
        else
            allToken = this.TokenGenerator(newData.ID, (await logInUser).is2FA, false);
        const HToken = await this.HTokenGenerator(allToken.RToken);
        await this.prisma.user.update({
            where :{
                userID : newData.ID,
                email : newData.email,
            },
            data:{
                RTokens : HToken,
                userOnline : true,
            }
        })
        return {...allToken, 
            is2FA,
            first_log,
        };
    }
    async userChecker(dataDTOEmail: string, dataDTOUserName: string):Promise<boolean>{
        const user = await this.prisma.user.findUnique({
            where: {
                email : dataDTOEmail,
            },
        });
        if (!user)
            return false;
        return true;
    }
    TokenGenerator(userID :string , TwoFA : boolean, check: boolean):Token{
        let AToken = this.jwt.sign({
            id : userID,
            is2FA : TwoFA,
            isfullauth : check,
        }, {
            secret : this.config.get('JWTATSECRET'),
            expiresIn : 60 * 60 * 24 * 7,
        });
        let RToken = this.jwt.sign({
            id : userID,
            is2FA : TwoFA,
            isfullauth : check,
        },{
            secret : this.config.get('JWTRTSECRET'),
            expiresIn : 60 * 15 * 4 * 24 * 30 * 7,
        });
        return {
            AToken: AToken,
            RToken : RToken,
        };
    }
    async HTokenGenerator(RToken: string):Promise<string>{
        const Hashed = crypt.hash(RToken, 10);
        return Hashed;
    }

    async userLogOut(id: string){
        await this.prisma.user.update({
            where : {
                userID : id,
            },
            data:{
                userOnline : false,
            },
        })
        return;
    }

    async refreshSessionTokens(userID: string, RToken : string): Promise<Token>{
        try{
            const User = this.prisma.user.findUnique({
                where : {
                    userID : userID,
                }
            });
            if(!User)
                throw new ForbiddenException('User not found');
            else{
                let comparedHash = await crypt.compare(RToken, (await User).RTokens);
                if (!comparedHash) throw new ForbiddenException('Token Problem, Please relog!');
                let userData : auth42dto = {
                    ID : (await User).userID,
                    email : (await User).email,
                    userName : (await User).userName,
                    link : '',
                };
                const Tokens = this.TokenGenerator(userData.ID, (await User).is2FA, true);
                const newHashedToken = await this.HTokenGenerator(Tokens.RToken);
                (await User).RTokens = newHashedToken;
                return Tokens;
            }
        }
        catch(e){
            throw new HttpException("User needs to relog", HttpStatus.FORBIDDEN);
        }
    }

    async   TwoFAVerification(user: userDTO, code: string){
        try{
            let allToken : Token;
            let authdone : boolean;
            if (!user)
                throw new ForbiddenException("Bad Request");
            const prismaUser = this.prisma.user.findUnique({
                where : {
                    userID : user.userID,
                },
            })
            if(authenticator.verify({token : code, secret : (await prismaUser).secret2FA})){
                authdone = true;
                allToken = this.TokenGenerator((await prismaUser).userID, (await prismaUser).is2FA, authdone);
            }
            else{
                authdone = false;
                allToken = this.TokenGenerator((await prismaUser).userID, (await prismaUser).is2FA, authdone);
            }
            return {...allToken,
                authdone};
        }
        catch(e){
            throw new HttpException("user not found", HttpStatus.FORBIDDEN);
        }
    }
}
