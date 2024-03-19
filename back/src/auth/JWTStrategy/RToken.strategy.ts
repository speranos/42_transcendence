import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport"
import { Strategy, ExtractJwt } from "passport-jwt"
import { Request } from "express"
import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
// export class RTokenStrategy  extends PassportStrategy(Strategy, 'jwtRefresh'){
//     constructor(config: ConfigService){
//         super({
//             jwtFromRequest : ExtractJwt.fromExtractors([(req: Request)=>{
//                 let data = req?.cookies['RToken'];
//                 return data;
//             }]),
//             ignoreExpiration : false,
//             secretOrKey : config.get('JWTRTSECRET'),
//             passReqToCallback: true,
//         })
//     };
//     validate(req: Request ,payload: any){
//         const RToken = req.cookies['RToken'];
//         if (!RToken) throw new ForbiddenException('Refresh Token Problem');
//         return {
//             ...payload,
//             RToken,
//         };
//     };
// }


/////


export class RTokenStrategy  extends PassportStrategy(Strategy, 'jwtRefresh'){
    constructor(private readonly config: ConfigService, private readonly prisma: PrismaService){
        super({
            jwtFromRequest : ExtractJwt.fromExtractors([
            RTokenStrategy.JWTextractor]),
            ignoreExpiration : false,
            secretOrKey : config.get('JWTRTSECRET'),
            passReqToCallback: true,
        })
    }
    private static JWTextractor(req: Request): string | null{
        if (req?.cookies && 'RToken' in req?.cookies)
            return req?.cookies.RToken;
        return null;
    }
    async validate(req: Request, payload: any){
        const RToken = req.cookies['RToken'];
            const user = this.prisma.user.findUnique({
                where:{
                    userID : payload.id,
                }
            });
            if(!user)
                throw new ForbiddenException("User not found");
            return {...user,
                    RToken,
            };
        };
    }