import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { FourTwoStrategy } from './42Strategy/42Strategy';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { ATokenStrategy } from './JWTStrategy/AToken.strategy';
import { RTokenStrategy } from './JWTStrategy/RToken.strategy';
import { TwoFactorService } from './two-factor/two-factor.service';

@Module({
  imports: [PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, FourTwoStrategy, JwtService, PrismaService, ATokenStrategy, RTokenStrategy, TwoFactorService]
})
export class AuthModule {}
