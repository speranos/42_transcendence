'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import socket, {Socket} from "socket.io-client";
import { FC, useEffect, useRef, useState } from 'react'
import { SocketAddress } from 'net'
import { useAuthContext } from '@/app/state/auth-context';

// interface  {
//   id: string
//   name: string
//   image: string
// }

interface Message {
  id: string;
  content: string;
  sendId: string;
  roomId: string;
  createdAt: any;
}

interface MessagesProps {
  initialMessages: Message[]
  sessionId: string
  groupId: string
  sessionImg: string | null | undefined
  chatPartner: { userID: string; userName: string; avatar:string}[]
  Socket: Socket; 
}


function formatTimestamp(timestamp : string): string {
  const date = new Date(timestamp);

  return ( date.getHours().toString() + ':' + date.getMinutes().toString());
}

const Messages: React.FC<MessagesProps> = ({
  initialMessages,
  sessionId,
  groupId,
  chatPartner,
  sessionImg,
  Socket
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const session = useAuthContext();
  //('from message Socket', Socket);
  //('from message groupID', groupId);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);
  //("Messages after the set HHHHHHH:", messages);

  useEffect(() => {
    if (!session) {
      console.error("Socket is not initialized.");
      return;
    }

    //('alooooooooooo ',groupId);
    Socket.on("message", (message:Message) => {
      //(' dfvdfgdfgdgfdfgdfg message from the back ', message);
        if(message.roomId === groupId){

          setMessages((prevMessages) => [...prevMessages, message]);
        }
    });

    return () => {
      Socket.off("message");
    };
  }, [groupId]);

  const scrollDownRef = useRef<HTMLDivElement | null>(null)
  //('from the message ',chatPartner);
  // const formatTimestamp = (timestamp: number) => {
  //   return format(timestamp, 'HH:mm')
  // }

  return (
    <div
      id='messages'
      className='flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto max-h-[calc(100vh - 4rem)] scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-backlight scrollbar-w-2 scrolling-touch pb-28'>
      <div ref={scrollDownRef} />

      {messages.slice().reverse().map((message, index) => {
        const isCurrentUser = message.sendId === sessionId
        const hasNextMessageFromSameUser =
          messages[index - 1]?.sendId === messages[index].sendId

        return (
          <div
            className='chat-message'
            key={`${message.id}-${message.createdAt}`} >
            <div
              className={cn('flex items-end', {
                'justify-end': isCurrentUser,
              })}>
              <div
                className={cn(
                  'flex flex-col space-y-2 text-base max-w-xs mx-2 border border-solid border-backdark rounded-xl',
                  {
                    'order-1 text-left  bg-blue': isCurrentUser,
                    'order-2 text-right  bg-gris': !isCurrentUser,
                  }
                )}>
                <span
                  className={cn('text-gradient m-4 text-2xl ', {
                    'text-backdark bg-blue': isCurrentUser,
                    'text-backdark bg-gris': !isCurrentUser,
                    'rounded-br-none':
                      !hasNextMessageFromSameUser && isCurrentUser,
                    'rounded-bl-none':
                      !hasNextMessageFromSameUser && !isCurrentUser,
                  })}>
                  <span className='text-xl text-backlight p-2 text-right justify-end underline'>
                  {chatPartner?.find(user => user.userID === message.sendId)?.userName || 'Unknown'} :
                </span>
                  {message.content}{' '}
                  <span className='ml-2 text-xs text-backdark p-2 text-right justify-end'>
                    {formatTimestamp(message.createdAt)}
                  </span>
                </span>
              </div>

              <div
                className={cn('relative w-6 h-6', {
                  'order-2': isCurrentUser,
                  'order-1': !isCurrentUser,
                  invisible: hasNextMessageFromSameUser,
                })}>
                  
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Messages
