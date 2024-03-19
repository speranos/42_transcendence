import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { FourTwoStrategy } from './auth/42Strategy/42Strategy';
import { UserModule } from './user/user.module';
import { MulterModule } from '@nestjs/platform-express';
import { ChatModule } from './chat/chat.module';
import { Gamemodule } from './game/gamemodule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


@Module({
  imports: [AuthModule,Gamemodule, ConfigModule.forRoot({isGlobal: true,}), UserModule, MulterModule.register({dest : '/data'}), ChatModule, ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', 'data'),
    serveRoot: '/data',
  }),],
  controllers: [],
  providers: [],
})
export class AppModule {}