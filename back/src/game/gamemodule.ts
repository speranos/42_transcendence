import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GameController } from './game.controller';
import { Colorful } from './colorfule';
import { GameService } from './game.service';
import { ClassicVip } from './classicvip';
// import { ColorfulVip } from './colorfulevip';
import { PrismaService } from 'src/prisma/prisma.service';
import { Classic } from './classic';
import { AuthModule } from 'src/auth/auth.module';



@Module({
  imports: [AuthModule, ConfigModule.forRoot({isGlobal: true,})],
  controllers: [GameController],
  providers: [Classic, Colorful, ClassicVip, GameService, PrismaService],
})
export class Gamemodule {}