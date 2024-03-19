"use client"
import React, { useEffect, useState } from 'react';
// import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import io from 'socket.io-client';
// import { useAuthContext } from 'next-auth';
// import { authOptions } from '@/lib/auth';
import { notFound } from 'next/navigation';
// import router from 'next/router';
import  { Socket } from "socket.io-client";
import { Label } from './ui/label';
import { Input } from './ui/input';
import Button from './ui/Buttons';
import { useAuthContext } from '@/app/state/auth-context';
import { useRouter } from 'next/navigation';

// const socket = io(); // Connect to the WebSocket server

const frameworks = [
  {
    value: "PUBLIC",
    label: "PUBLIC",
  },
  {
    value: "PRIVATE",
    label: "PRIVATE",
  },
  {
    value: "PASSWORD_PROTECTED",
    label: "PASSWORD_PROTECTED",
  },
];

interface Room {
  name: string;
  id: string;
  type: string;
  members?: string[]; 
  password?: string; // Added password field
}

interface Props {
  socket: Socket;
}

export  function CardWithForm({socket }: Props) {
  //("Cardwith From")
  const session = useAuthContext();
  //('session', session);
  const router = useRouter();
  const [room, setRoom] = useState<Room>({
    name: "",
    id: "",
    type: "PUBLIC", // You might want to set a default type
    members: [],
    password: ""
  });

  useEffect(() => {
    socket.on('room data', (room: any) => {
      //('room data', room);
      router.push(`/Chat/group/${room.id}`);
    });

    return () => {
      socket.off('room data');
    };
  }, [socket]);

  useEffect(() => {
    if (!room.type) {
      setRoom({...room, type: "PUBLIC"});
    }
  }, [room.type]);
  
    const handleCreateRoom = () => {
      //('yoooooooooooooo');
      //('room', room);
      //('room name', room.name , 'room.type', room.type);
      if( room.name && room.type === 'PASSWORD_PROTECTED' && room.password)
      {
        socket.emit('create-room', room.name, room.type, room.password);
      }
      else if(room.name && room.type !== 'PASSWORD_PROTECTED')
      {
        socket.emit('create-room', room.name, room.type, room.password);
      }
    };


  return (
    <Card className="w-[350px] bg-lavender">
      <CardHeader>
        <CardTitle>Create Group</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5 text-gris">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Name of your Group"
                value={room.name}
                onChange={(e) => setRoom({...room, name: e.target.value})}
              />
            </div>
            <div className="flex flex-col space-y-1.5 text-gris">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                value={room.type}
                onChange={(e) => setRoom({...room, type: e.target.value})}
                className="w-full pr-10 pl-3 py-2 border rounded-lg"
              >
                {frameworks.map((framework) => (
                  <option key={framework.value} value={framework.value}>
                    {framework.label}
                  </option>
                ))}
              </select>
            </div>
            {room.type === 'PASSWORD_PROTECTED'  &&( 
              <div className="flex flex-col space-y-1.5 text-gris">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={room.password}
                  onChange={(e) => setRoom({...room, password: e.target.value})}
                />
              </div>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
       
        <Button onClick={handleCreateRoom}> Create </Button>
      </CardFooter>
    </Card>
  );
}
