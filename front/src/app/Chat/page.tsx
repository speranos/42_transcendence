"use client"

import { ChevronRight } from 'lucide-react'
import Layout from '@/app/main_layout';
import Image from 'next/image'
import Link from 'next/link'
import { notFound, useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from 'react'

import { io } from 'socket.io-client'
import { useAuthContext } from '@/app/state/auth-context'
import { Socket } from 'socket.io-client'
import CardButton from './chatComponents/CardButton'
import Button from './chatComponents/ui/Buttons'
import getFetchRoomsByUserId from './getFetchRoomsByUserId'
import ShowRooms from './chatComponents/ShowRooms';
// import router from 'next/router'

interface Room {
  id: string;
  name: string;
  type: string;
  members: { userID: string,userName: string};
  banedusers: string[]; 
}

const Chat:React.FC =  () => {
  const session = useAuthContext();
  const route = useRouter();
  //('session', session);
  //('session', session.user?.userID);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomPasswords, setRoomPasswords] = useState<{ [roomId: string]: string }>({});
  

  useEffect(() => {
    async function fetchRooms() {
        try {
            if (session.user?.userID) {
                const fetchedRooms = await getFetchRoomsByUserId(session.user?.userID);
                setRooms(fetchedRooms);
            }
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    }

    fetchRooms();
}, [session]);

const gologin = () => {
  route.replace('/');
}
if(!session.isAuthenticated){
  return <Layout><div className='flex items-center justify-center text-gradient p-20 underline'>unknown user, Please Log In Again
  <div className='w-10'></div><Button className='flex items-center justify-center text-gradient  underline border border-solid border-blue px-20' onClick={gologin}>To Login Page</Button>
  </div></Layout>;
}
  //('rooms yooo ', rooms);
  if (!session.user) {
    return <div>loading...</div>;
  }
  return (
    <Layout>
    <div className='flex justify-between items-center h-screen bg-backdark'>
    <div className='py-8 px-3 space-y-4 text-backlight'>
      {session.socket && <CardButton Socket={session.socket}/>}
    </div>
    <div className='flex-grow'>
      {session.socket && <ShowRooms rooms={rooms} userID={session.user.userID} Socket={session.socket}/>}
    </div>
    </div>
     </Layout>
  )
}

export default Chat
