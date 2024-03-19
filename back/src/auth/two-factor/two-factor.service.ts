import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { auth42dto, userDTO } from '../../alldtos';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode'

@Injectable()
export class TwoFactorService {
    constructor(private prisma: PrismaService){}

    public async generatePrivateCode(userX: userDTO){
        try{
            if (userX && userX.is2FA){
                const secret = authenticator.generateSecret();
                const application = "ft_transcendence";
                const account = userX.userName;
                await this.prisma.user.update({
                    where : {
                        userID : userX.userID,
                    },
                    data : {
                        secret2FA : secret,
                    }
                });
                const generatedurl = authenticator.keyuri(account, application, secret);
                return generatedurl; 
            }
            else{
                throw new ForbiddenException("User not there");
            }
        }
        catch(e){
            throw new HttpException("User not found", HttpStatus.FORBIDDEN);
        }
    }
}
