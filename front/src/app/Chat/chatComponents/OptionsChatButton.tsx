"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { Menubar, 
    MenubarContent, 
    MenubarItem, 
    MenubarMenu, 
    MenubarSeparator, 
    MenubarTrigger } 
    from './ui/menubar';
import socket, { Socket } from "socket.io-client";
import Button from './ui/Buttons';


interface Room {
    id: string;
    name: string;
    type: string;
    members:{ userID: string; userName: string;avatar : string }[];
    membership: {userID: string; role: string; ismuted: boolean;}[];
}

interface Props {
    room: Room;
    userId: any;
    Socket: Socket; 
}

export default function OptionsChatButton({room,userId,Socket}:Props) {
    // const router = useRouter();

    const router = useRouter();
    const handleInviteToGame = async () => {
    let playerid = '';
    if (room.members[0].userID == userId)
        playerid = room.members[1].userID;
    else
        playerid = room.members[0].userID;
        try {
            const api = `${process.env.NEXT_PUBLIC_API_URL}/game/send-request/` + playerid;
            const response = await fetch(api, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.text();
            router.push('../../gamevip/' + data);
            } catch (error) {
                console.error('Error adding friend:', error);
            }
          };

    // const handleUnfriend = () => {
        
    //     //("'Unfriend' was clicked");
    // };

    // const handleBlock = () => {
    //     Socket.emit('block',room?.members?.find((member) => member.userID !== userId)?.userID)
    //     //("'Block' was clicked");
        
    // };

    return (
        <Menubar className='bg-blue'>
            <MenubarMenu >
                <MenubarTrigger className=" bg-blue text-backdark ">options</MenubarTrigger>
                <MenubarContent className="w-56  bg-blue text-backdark   overflow-hidden">
                    <MenubarItem onClick={handleInviteToGame}>
                    {/* <Link href="/game" passHref> */}
                        Invite to game
                    {/* </Link> */}
                        </MenubarItem>
                    {/* <MenubarSeparator /> */}
                    {/* <MenubarItem onClick={handleUnfriend}>Unfriend</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem onClick={handleBlock}>Block</MenubarItem> */}
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
}

