"use client"

import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "./ui/dropdown-menu";
import io from "socket.io-client";
import socket, { Socket } from "socket.io-client";
import { use, useEffect, useState } from "react";
import { useAuthContext } from "@/app/state/auth-context";
import { useRouter } from "next/navigation";
import M_fetch from "@/app/utils/M_fetch";
import { tryGetJson } from "@/app/utils/json"



// interface Room
interface Room {
    id: string;
    name: string;
    type: string;
    members: { userID: string; userName: string; }[];
    membership: { userID: string; role: string; ismuted: boolean; muteend: boolean; }[];
}
interface Member {
    userID: string;
    userName: string;
}

interface Props {
    room: Room;
    userId: any;
    Socket: Socket;
}

interface Friendship {
    userID: string;
    userName: string;
    userAvatar: string;
    isOnline: boolean,
    isInGame: boolean,
  }

export default function DropDownmenu({ room, userId, Socket }: Props) {
    const session = useAuthContext();
    const router = useRouter();
    const [newPassword, setNewPassword] = useState('');
    const [showChangePasswordCard, setShowChangePasswordCard] = useState(true);
    const [Friends, setFriends] = useState<Friendship[]| null>([]);

    useEffect(() => {
        //('name', name)
    
        const Freindlist = async () => {
        try {
          const resp = await M_fetch.get(`/profile/friendslist/${session.user?.userID}`, {credentials: "include"});
          if (resp.status === 200) {
            const data: Friendship[] = await tryGetJson(resp) as Friendship[];
            // //()
              setFriends(data);
    
            } else {
              console.error('bad response');
            }
        } catch (error) {
          console.error('Error loading friends:', error);
        }
      };
      Freindlist();
      }, [session]);


    const handleShowfriends = () => {
        //("");

    };
    useEffect(() => {
        Socket.on('user kick success', () => {
            //("User kicked successfully!");
            router.push("/Chat");

        });

        Socket.on('user ban success', (id:string) => {
            if(room.id === id)
            {
            //("User banned successfully!");
            router.push("/Chat");
            }
        });

        return () => {
            Socket.off('user kick success');
            Socket.off('user ban success');
        };
    }, [room.id]);

    const handleSetadmin = (memberId: string, roomId: string) => {
        if (!socket) return;
        //("memberID and RoomID", memberId, roomId);
        Socket.emit("set admin", memberId, roomId);
        //("yooo");
    };

    const handleBan = (memberId: string, roomId: string) => {
        Socket.emit("Ban", memberId, roomId);
        //("ban");
    };

    const handleKick = (memberId: string, roomId: string) => {

        Socket.emit("kick", memberId, roomId);
        //("kick");

    };
    const handleMute = (memberId: string, roomId: string) => {

        Socket.emit("Mute", memberId, roomId);
        //("mute");

    };
    const handleAdd = (memberId: string, roomId: string) => {

        Socket.emit("add member", memberId, roomId);
        //("add ");

    };
    const handleQuite = (roomId: string) => {

        Socket.emit("leave room", room.id);
        router.push('/Chat');
        //("quite");

    };
    const handleChangePassword = () => {
        if(newPassword)
            Socket.emit("add room pass", room.id, newPassword);
            // setShowChangePasswordCard(false);
    };
    const handlerRemovePass = () => {
        Socket.emit("remove room pass", room.id);
    };
    const handleDelete =    () => {
        Socket.emit("delete room", room.id);
        router.push('/Chat');
    };
    
    // const handleToggleCard = () => {
    //     setShowChangePasswordCard(!showChangePasswordCard);
    // };
    //("room", room.members);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className=" bg-blue text-backdark ">Options</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56  bg-blue text-backdark   overflow-hidden">
                <DropdownMenuGroup>
                    <DropdownMenuItem>Members</DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Room setings </DropdownMenuSubTrigger>
                        <DropdownMenuPortal >
                            <DropdownMenuSubContent className="w-56  bg-blue text-backdark   overflow-hidden">
                                <DropdownMenuItem onClick={handlerRemovePass}>remove password</DropdownMenuItem>
                                <DropdownMenuItem >change Password </DropdownMenuItem>
                                {showChangePasswordCard && (
                                    <div className="p-4">
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value) }
                                            placeholder="Enter new password"
                                            className="w-full mb-2 px-2 py-1 border border-gray-300 rounded"
                                        />
                                        <Button onClick={handleChangePassword} className="w-full px-2 py-1 bg-blue text-white rounded">
                                            Save
                                        </Button>
                                    </div>
                                )}
                                <DropdownMenuItem onClick={handleDelete}>delete romm</DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Set Admin </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent className="w-56  bg-blue text-backdark   overflow-hidden">
                                <DropdownMenuItem>{room.members && room.members.map((member: Member) => (
                                    session.user?.userID !== member.userID && (
                                        <DropdownMenuItem key={member.userID} onClick={() => handleSetadmin(member.userID, room.id)}>
                                            {member.userName}
                                        </DropdownMenuItem>
                                    )
                                ))}</DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Ban Members </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent className="w-56  bg-blue text-backdark   overflow-hidden">
                                <DropdownMenuItem>{room.members && room.members.map((member: Member) => (
                                    session.user?.userID !== member.userID &&
                                    (<DropdownMenuItem key={member.userID} onClick={() => handleBan(member.userID, room.id)}>
                                        {member.userName}
                                    </DropdownMenuItem>)
                                ))}</DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Mute Members </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent className="w-56  bg-blue text-backdark   overflow-hidden">
                                <DropdownMenuItem>{room.members && room.members.map((member: Member) => (
                                    session.user?.userID !== member.userID &&
                                    (<DropdownMenuItem key={member.userID} onClick={() => handleMute(member.userID, room.id)}>
                                        {member.userName}
                                    </DropdownMenuItem>)
                                ))}</DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Kick Members </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent className="w-56  bg-blue text-backdark   overflow-hidden">
                                    <DropdownMenuItem className="flex flex-col">{room.members && room.members.map((member: Member) => (
                                        session.user?.userID !== member.userID &&
                                        (<DropdownMenuItem key={member.userID} onClick={() => handleKick(member.userID, room.id)}>
                                            {member.userName}
                                        </DropdownMenuItem>)
                                    ))}</DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Add users</DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent className="w-56  bg-blue text-backdark   overflow-hidden">
                            {Friends && Friends.map((Friend : Friendship) => (<DropdownMenuItem key={Friend.userID} onClick={()=>handleAdd(Friend.userID,room.id)}>{Friend.userName}</DropdownMenuItem>))}
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem >
                    <button onClick={()=>handleQuite(room.id)}>

                    Quite
                    </button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
//remove password , add password delete room 




