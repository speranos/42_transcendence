import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class auth42dto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    ID : string
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    userName : string;
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email : string;
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    link : string;
};
