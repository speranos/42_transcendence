import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from "class-validator"

export class requestsDTO{
    @IsString()
    @IsNotEmpty()
    requestID : string;
    @IsString()
    @IsNotEmpty()
    senderID :  string;
    @IsString()
    @IsNotEmpty()
    senderUsername : string;
    @IsEmail()
    @IsNotEmpty()
    senderavatar : string;
    @IsBoolean()
    @IsNotEmpty()
    specialMode? : boolean;
};

export class SrequestsDTO{
    @IsString()
    @IsNotEmpty()
    requestID : string;
    @IsString()
    @IsNotEmpty()
    senderID :  string;
    @IsString()
    @IsNotEmpty()
    senderUsername : string;
    @IsEmail()
    @IsNotEmpty()
    senderavatar : string;
    @IsBoolean()
    @IsNotEmpty()
    specialMode? : boolean;
    @IsString()
    @IsNotEmpty()
    status : string;
};
