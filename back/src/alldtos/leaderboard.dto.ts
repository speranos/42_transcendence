import { Decimal } from "@prisma/client/runtime/library";
import { IsAlpha, IsBoolean, IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator";

export class leaderBoardDto {
    @IsString()
    @IsNotEmpty()
    userName: string;
    @IsString()
    @IsNotEmpty()
    avatar: string;
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    rank:   number;
    @IsNumber()
    winrate: string;
    @IsBoolean()
    isFriend : boolean;
    @IsBoolean()
    isOwner : boolean;
    @IsBoolean()
    isOnline : boolean;
    @IsBoolean()
    isInGame : boolean;

    // @IsNotEmpty()
    // @IsObject()
    // Games: object;
}