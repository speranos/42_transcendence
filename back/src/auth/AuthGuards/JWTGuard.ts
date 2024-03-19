import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt'){}
export class Jwt_refresh_Guard extends AuthGuard('jwtRefresh') {}