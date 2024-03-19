"use client"


import Image from 'next/image'
import { notFound } from 'next/navigation'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";

interface Message {
  id: string;
  content: string;
  sendId: string;
  roomId: string;
  createdAt: any;
}

interface Room {
  id: string;
  name: string;
  type: string;
  members: { userID: string; userName: string; avatar: string }[];
  membership: { userID: string; role: string; ismuted: boolean; }[];
}

import { usePathname } from 'next/navigation'
import DropDownmenu from '../../chatComponents/DropDownmenu';
import ChatInput from '../../chatComponents/ChatInput';
import Messages from '../../chatComponents/Messages';
import Layout from '@/app/main_layout'
import { useAuthContext } from '@/app/state/auth-context'
import getAllMessagesByroomID from '../../getAllMessagesByroomID';
import OptionsChatButton from '../../chatComponents/OptionsChatButton';
import { Button } from '@/components/ui/button';

const page = () => {
  const router = useRouter();
  const pathname = usePathname()
  const parts = pathname.split('/');
  const roomId = parts[parts.length - 1];
  const [room, setRoom] = useState<Room>({} as Room);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const session = useAuthContext();


  if (!session) {
    return
    <div>loading...</div>;
  }

  //('DM page begin roomId', roomId);

  useEffect(() => {
    if (!session.socket || !roomId) return;

    async function fetchMessages() {
      try {
        if (roomId && session.user?.userID) {
          const fetchedMessages = await getAllMessagesByroomID(roomId, session.user?.userID);
          //('fetchedMessages', fetchedMessages);
          setMessages(fetchedMessages);
        }
      } catch (error) {
        router.push('/Chat');
        // console.error("Error fetching Messages:", error);
      }
    }
    session.socket.emit('getroom', roomId);
    session.socket.emit('join room', roomId, "yoo");
    session.socket.on('room', (room: any) => {
      setRoom(room);
    });

    fetchMessages();
    return () => {
      if (!session.socket) return;
      session.socket.off('room');

    };

  }, [session.socket, roomId]);



  // useEffect(() => {
  //   async function fetchMessages() {
  //     try {
  //       if (roomId) {
  //         const fetchedMessages = await getAllMessagesByroomID(roomId);
  //         //('fetchedMessages', fetchedMessages);
  //         setMessages(fetchedMessages);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching Messages:", error);
  //     }
  //   }

  //   fetchMessages();
  // }, [roomId]);

  const gotoProfile = () => {
    router.push(`/Profile/${room?.members?.find((member) => member.userID !== session.user?.userID)?.userID}`);
  };

  const gologin = () => {
    router.replace('/');
  }
  if(!session.isAuthenticated){
     return <Layout><div className='flex items-center justify-center text-gradient p-20 underline'>unknown user, Please Log In Again
  <div className='w-10'></div><Button className='flex items-center justify-center text-gradient  underline border border-solid border-blue px-20' onClick={gologin}>To Login Page</Button>
  </div></Layout>;
  }


  return (
    <Layout>

      <div className='flex-1 justify-between flex flex-col h-screen bg-backdark'>
        <div className='flex sm:items-center justify-between py-3 border-b-2 border-gris text-backlight'>
          <div className='relative flex items-center space-x-4'>
            <div className='relative'>
              <div className='relative w-8 sm:w-12 h-8 sm:h-12'>
                {/* <Image
                fill
                referrerPolicy='no-referrer'
                src={session.user?.link || '/default.jpeg'}
                alt={`${room.members.find((member) => member.userID !== session.user?.userID)?.avatar} profile picture`} // add ${room.name} 
                className='rounded-full'
              /> */}
              </div>
            </div>
            <div className='flex flex-col leading-tight'>
              <div className='text-xl flex items-center'>
                <span className='text-gray-700 mr-3 font-semibold'>
                  <a onClick={gotoProfile} className='text-gray-700 mr-3 font-semibold'>
                    {room?.members?.find((member) => member.userID !== session.user?.userID)?.userName || 'Default Username'}
                  </a>
                </span>
              </div>
            </div>
          </div>
          {session.socket && <OptionsChatButton room={room} userId={session.user?.userID} Socket={session.socket} />}
        </div>
        {
          session.socket && (
              <Messages
                initialMessages={messages}
                sessionId={session.user?.userID || ''}
                groupId={room.id}
                chatPartner={room.members}
                sessionImg="back/default.jpeg"
                Socket={session.socket}
              />
          )
        }
        {session.socket && <ChatInput chatId={roomId} chatPartner={room.members} Socket={session.socket} />}
    </div>
    </Layout >
  )

}

export default page