import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator";

export class userProfileDTO{
    @IsString()
    @IsNotEmpty()
    userID : string ;
    @IsString()
    @IsNotEmpty()
    userName : string ;
    @IsString()
    @IsNotEmpty()
    userEmail : string ;
    @IsString()
    @IsNotEmpty()
    userAvatar : string ;
    @IsString()
    @IsNotEmpty()
    WinRate : string ;
    @IsBoolean()
    isOwner : Boolean;
    @IsBoolean()
    isFriend : Boolean;
    @IsBoolean()
    isFriendReq : Boolean;
    @IsBoolean()
    isOnline : Boolean;
    @IsBoolean()
    isInGame : Boolean;
}

export class friendsListDTO{
    @IsString()
    @IsNotEmpty()
    userID : string ;
    @IsString()
    @IsNotEmpty()
    userName : string;
    @IsString()
    @IsNotEmpty()
    userAvatar : string;
    @IsBoolean()
    isOnline : Boolean;
    @IsBoolean()
    isInGame : Boolean;
}
export class achievementsListDTO{
    @IsString()
    @IsNotEmpty()
    userID : string;
    @IsString()
    @IsNotEmpty()
    achievementID : string;
    @IsString()
    @IsNotEmpty()
    description : string;
    @IsString()
    @IsNotEmpty()
    prizeImg : string;
    @IsDateString()
    @IsNotEmpty()
    time : Date;
}

export class Player{
    @IsString()
    @IsNotEmpty()
    playerID : string;
    @IsString()
    @IsNotEmpty()
    playerUsername : string;
    @IsString()
    @IsNotEmpty()
    playerAvatar : string;
    @IsNumber()
    @IsNotEmpty()
    Score : number;
}
export class matchHistoryListDTO{
    @IsString()
    @IsNotEmpty()
    gameID : string;
    @IsObject()
    @IsNotEmpty()
    player1 : Player;
    @IsObject()
    @IsNotEmpty()
    player2 : Player;
    @IsString()
    @IsNotEmpty()
    WinnerID : string;
    @IsBoolean()
    specialMode : boolean;
}

export class blockedUsersList{
    @IsString()
    @IsNotEmpty()
    userID : string;
    @IsString()
    @IsNotEmpty()
    userName : string;
    @IsString()
    @IsNotEmpty()
    avatar: string;
}