'use client'

import { FC, useEffect, useRef, useState } from 'react'
import Button from './ui/Buttons'
import TextareaAutosize from 'react-textarea-autosize'
import socket, { Socket } from "socket.io-client";
import { useAuthContext } from '@/app/state/auth-context'

interface User {
  id: string
  name: string
  image: string
}

interface ChatInputProps {
  chatId: string
  chatPartner: User[]
  Socket: Socket;
}

const ChatInput: React.FC<ChatInputProps> = ({ chatId, chatPartner, Socket }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [input, setInput] = useState<string>('')
  const session = useAuthContext();
  const userId = session.user?.userID
  // //('Chatid yooo', chatId);
  // //('Socket', Socket);
  // //('chatPartner', userId);

  const sendMessage = () => {
    if (!input.trim()) {
      return;
    }
    setIsLoading(true);
    // //('chatId', chatId);
    // //('input', input);
    Socket.emit('send message', chatId, input);

    setInput('');
    setIsLoading(false);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [chatId, input]);


  return (
    <div className='fixed bottom-0 w-full sm:mb-0 backdrop-blur-3xl border border-solid border-backlight'>
      <div className=' grid grid-cols-2 rounded-lg shadow-sm w-full h-full mb-2'>
        <div className="flex items-center justify-start h-full w-full m-2">

          <TextareaAutosize
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message`}
            className='flex w-full h-full rounded-sm resize-none border-0 bg-transparent text-backdark placeholder:text-lavender focus:ring-0 sm:py-1.5 sm:text-lg sm:leading-6'
          />
        </div>

        <div className='flex w-full items-center justify-center'>
          <div className='flex-shrin-0 h-12 w-24'>
            <Button isLoading={isLoading} onClick={sendMessage} type='button'> {/* Change type to 'button' */}
              Send
            </Button>
          </div>
        </div>
        
      </div>

    </div>
        // {/* <div
        //   onClick={() => textareaRef.current?.focus()}
        //   className='py-2'
        //   aria-hidden='true'>
        //   <div className='py-px'>
        //     <div className='h-9' />
        //   </div>
        // </div> */}

  )
}

export default ChatInput
