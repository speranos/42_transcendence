import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { Request } from "express"
import { ForbiddenException, Injectable} from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import { Prisma } from "@prisma/client"
import { userDTO } from "src/alldtos"

@Injectable()
export class ATokenStrategy  extends PassportStrategy(Strategy, 'jwt'){
    constructor(private readonly config: ConfigService, private readonly prisma: PrismaService){
        super({
            jwtFromRequest : ExtractJwt.fromExtractors([
            ATokenStrategy.JWTextractor]),
            ignoreExpiration : false,
            secretOrKey : config.get('JWTATSECRET'),
            passReqToCallback : true,
        })
    }
    private static JWTextractor(req: Request): string | null{
        if (req?.cookies && 'AToken' in req?.cookies)
            return req.cookies.AToken;
        return null;
    }
    async validate(req: Request, payload: any){
        try{
            const userdata = await this.prisma.user.findUnique({
                where:{
                    userID : payload.id,
                }
            });
            if(!userdata)
                throw new ForbiddenException("User not found");
            const user : userDTO = {
                userID : (await userdata).userID,
                userName : (await userdata).userName,
                is2FA : (await userdata).is2FA,
                link : (await userdata).avatar,
            }
            return user;
        }
        catch(e){
            throw new ForbiddenException('Token Expired!')
        }
        }
    }