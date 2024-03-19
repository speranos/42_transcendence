import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNotEmpty, IsString, isBoolean, isEmail, isNotEmpty, isString } from "class-validator"

export class userDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    userID : string;
    @ApiProperty()
    @IsString()
    link : string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    userName : string;
    @ApiProperty()
    @IsBoolean()
    is2FA : boolean
};