import { ApiProperty } from "@nestjs/swagger";
import { Decimal } from "@prisma/client/runtime/library";
import { IsBoolean, IsDecimal, IsEmail, IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator"
import internal from "stream";

export class returnuserDTO{
    @IsString()
    @IsNotEmpty()
    userID : string
    @IsString()
    @IsNotEmpty()
    username : string
    @IsBoolean()
    IsOwn   : Boolean
    @IsBoolean()
    IsBlocked : Boolean
    @IsString()
    @IsNotEmpty()
    email : string
    @IsString()
    @IsNotEmpty()
    avatar : string
    @IsDecimal()
    @IsNotEmpty()
    WinRate : number
    @IsBoolean()
    IsFriend : Boolean
    @IsObject()
    friendsList : object
    @IsObject()
    gameHistory : object
    @IsObject()
    achievements : object 
}