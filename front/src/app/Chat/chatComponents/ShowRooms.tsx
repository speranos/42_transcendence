import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
// import { Input } from "@/components/ui/input"
import { Socket } from "socket.io-client";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";

interface room {
  id: string;
  name: string;
  type: string;
  members: member[];
  banedusers: {useID:string}[];
}
interface member {
  userID: string;
  userName: string;
}

interface Props {
  rooms: room[];
  userID: string;
  Socket: Socket
}


export function ShowRooms({ rooms, userID, Socket }: Props) {
  const [roomPasswords, setRoomPasswords] = useState<{ [roomId: string]: string }>({});
  const router = useRouter();

  useEffect(() => {
    if (Socket) {
      Socket.on('joined', (roomId: string) => {
        navigateToRoom(roomId, rooms.find((room) => room.id === roomId)?.type || 'PUBLIC');
      });
    }
    return () => {
      Socket?.off('joined');
    }
  }, [rooms]);

  const handleCardClick = (roomId: string, roomType: string,) => {
    //('roomType', roomType);
    if (roomType === 'PASSWORD_PROTECTED' && Socket && roomPasswords[roomId]) {
      //('room protected password ', roomPasswords[roomId]);
      Socket.emit('join room', roomId, roomPasswords[roomId]);
    }
    else if (roomType !== 'PASSWORD_PROTECTED') {
      navigateToRoom(roomId, roomType);
    }
  };

  const navigateToRoom = (roomId: string, roomType: string) => {
    if (roomType === 'DM') {
      router.push(`/Chat/Dm/${roomId}`);
    } else {
      router.push(`/Chat/group/${roomId}`);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>, roomId: string) => {
    if (event.key === 'Enter') {
      handleCardClick(roomId, 'PASSWORD_PROTECTED');
    }
  };

  const join = (roomId: string, roomType: string,) => {
    navigateToRoom(roomId, roomType);
  };  


  return (
    <div className="flex justify-center items-center h-screen  overflow-x-hidden text-backlight">
      <div className="w-full max-w-md p-6 backdrop-blur-lg rounded-lg shdow-backlight shadow-inner border border-solid border-backlight">
        <h2 className="flex justify-center text-2xl font-bold mb-4 bg-backlight text-backdark p-3 rounded-xl">Recent Rooms/DMs</h2>
        <div className="scroll-content">
          <table className="w-full">
            <caption className="text-lg mb-2 ">A list of your recent Rooms/Dms.</caption>
            <thead>
              <tr>
                <th className="w-3/2  py-2 font-bold text-xl underline">Room/Dm Name</th>
                <th className="w-3/2 py-2 font-bold text-xl underline">Type</th>
              </tr>
            </thead>
            <tbody >
              {rooms.filter(room => !room.banedusers || !room.banedusers.some(user => user.userID === userID)).map(room => (
                 <tr key={room.id} onClick={() => handleCardClick(room.id, room.type)} className="cursor-pointer hover:bg-gray-100">
                  <td className="mr-12 pl-8 pr-6 py-2 font-medium text-center">
                    {room.type === 'DM' ? room.members.find((member) => member.userID !== userID)?.userName : room.name}
                  </td>
                  {room.type !== 'PASSWORD_PROTECTED' ? (
                    <td className="px-4 py-2 text-center block">{room.type}</td>
                  ) : (
                    <td className="block px-4 py-2 text-center">
                      {room.members.some((member) => member.userID === userID) ? (
                        
                        <a className="text-sm underline text-backlight" onClick={() => join(room.id, room.type)}>Join
                        (room protected)
                        </a>
                      ) : (
                        <>
                          <input
                            type="password"
                            value={roomPasswords[room.id] || ""}
                            onChange={(e) => {
                              const newPasswords = { ...roomPasswords };
                              newPasswords[room.id] = e.target.value;
                              setRoomPasswords(newPasswords);
                            }}
                            onKeyPress={(e) => handleKeyPress(e, room.id)}
                            placeholder="Enter password"
                            className="px-2 py-1 border text-backdark rounded-md focus:outline-none focus:border-blue-500 w-"
                          />
                          {/* <a className="text-sm underline text-backlight ml-2" onClick={() => join(room.id, room.type)}>Join</a> */}
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))}

              {/* {rooms
            .filter((room) => !room.banedusers || !room.banedusers.includes(userID))
            .map((room) => (
              <tr key={room.id} onClick={() => handleCardClick(room.id, room.type)} className="cursor-pointer hover:bg-gray-100">
                <td className="px-4 py-2 font-medium">{room.type === 'DM' ? room.members.find((member) => member.userID !== userID)?.userName : room.name}</td>
                {room.type !== 'PASSWORD_PROTECTED' ? <td className="px-4 py-2">{room.type}</td> 

                :  
                  <td className="block px-4 py-2">
                    <input
                      type="password"
                      value={roomPasswords[room.id] || ""}
                      onChange={(e) => {
                        const newPasswords = { ...roomPasswords };
                        newPasswords[room.id] = e.target.value;
                        setRoomPasswords(newPasswords);
                      }}
                      onKeyPress={(e) => handleKeyPress(e, room.id)}
                      placeholder="Enter password"
                      className="px-2 py-1 border rounded-md focus:outline-none focus:border-blue-500 w-"
                    />
                    <a className="text-sm underline text-backlight" onClick={() => join(room.id, room.type)} >Join</a>
                  </td>
                
                }
              </tr>
            ))} */}
            </tbody>
          </table>
        </div>
      </div>
    </div>

  )
} export default ShowRooms
