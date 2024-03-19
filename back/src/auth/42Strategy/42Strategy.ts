import { PassportStrategy } from "@nestjs/passport"
import { Strategy, VerifyCallBack } from "passport-42"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { config } from "process";
import { Injectable, Req } from "@nestjs/common";
import { auth42dto } from "../../alldtos";

@Injectable()
export class FourTwoStrategy extends PassportStrategy(Strategy, '42'){
    constructor(config: ConfigService){
    super({
        clientID : config.get('CLID') ,
        clientSecret : config.get('CLISECRET'),
        callbackURL : config.get('callBackURL'),
        });
    }
    async validate(accessToken: string, refreshToken: string, profile: any,done: VerifyCallBack): Promise<auth42dto>{
       try{
        const user:auth42dto =  {
          ID: profile.id,
          userName: profile.username,
          email: profile._json.email,
          link: profile._json.image.link, 
        };
        done(null, user)
        return user;}
        catch(e){done(e, false)};
}}