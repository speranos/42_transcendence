'use client'
import React from 'react'
import { useState, useEffect} from "react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuthContext } from '@/app/state/auth-context'
import M_fetch from '@/app/utils/M_fetch'
import { useRouter } from 'next/navigation'
import { tryGetJson } from '@/app/utils/json'

interface Player{
  playerID: string;
  playerUsername: string;
  playerAvatar: string;
  Score: number;
}

interface Games {
  gameID : string;
  player1 : Player;
  player2  : Player;
  WinnerID: string;
  specialMode: boolean;
}

interface User {
  id: string;
  avatar: string;
  username: string;
  // other user details
}

interface HistoryCardProps {
  id: string;
  // other user details
}



const HistoryCard: React.FC<HistoryCardProps> = ({ id }) => {
  const ctx = useAuthContext();
  const [games, setGames] = useState<Games[] | null>(null);
  // const User = ctx.user;
  const route = useRouter();
  // const username = 'user1'

  useEffect(() => {
    const gameslist = async () => {
    try {
      // //(';sending');
      const resp = await M_fetch.get(`/profile/matchhistory/${id}`, {});
      // //('games',resp);
      if (resp.status === 200) {
        const data: Games[] = await tryGetJson(resp) as Games[];
        setGames(data);
      } else {
        console.error('bad response');
      }
    } catch (error) {
      console.error('Error loading games:', error);
    }
  };
  gameslist();
  }, []);

  const handleAvatarClick = (name: string) => {
    if(name){
      route.push(`/Profile/${name}`)
    }
  };
  

  // //('data', games);

  return (
    <Card className="w-2/3 h-72 shadow text-backlight shadow-backlight">
      <CardHeader>
        <CardTitle>History</CardTitle>
        <CardDescription>
          Recent Games.
        </CardDescription>
      </CardHeader>
      {/* {friends.map((friend) => ( */}
      <div className="scroll-content">

      <div className="flex items-center justify-center">

        <CardContent className="grid gap-6">
         {games && games.map((game) => (
           <div key={game.gameID} className="flex items-center justify-between space-x-4">
            <div className="flex items-right space-x-4">
              <Avatar onClick={() => handleAvatarClick(game.player1.playerID)}>
              {/* <a href="redirection profile" onClick={() => handleAvatarClick(game.player1.playerUsername)}> */}
                <AvatarImage src={game.player1.playerAvatar} />
              {/* </a> */}
              </Avatar>
              <div className="block w-full">
                <ul>
                  <div className="flex m-2 w-full">
                    <li className="text-left">{game.player1.playerUsername}</li>
                    <p className="inline px-4 w-max" >{game.player1.Score} - {game.player2.Score}</p>
                    <li className="text-right">{game.player2.playerUsername} </li>
                  </div>
                </ul>
              </div>
              <Avatar onClick={() => handleAvatarClick(game.player2?.playerID)}>
                {/* <a href="redirection profile" onClick={() => handleAvatarClick(game.player2?.playerUsername)}> */}
                <AvatarImage src={game.player2.playerAvatar} />
                {/* </a> */}
              </Avatar>
            </div>
          </div>
        ))}
        </CardContent>
      </div>
        </div>
      {/* ))} */}
    </Card>
    // <Card>
    //   <div className="flex flex-col h-full w-72">
    //     <div className="flex justify-between items-center p-2 pt-4">
    //       <h1 className="text-2xl font-bold">History</h1>
    //       <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
    //         Clear
    //       </button>
    //     </div>
    //     <div className="flex justify-between items-center p-2">

    //       <h2 className="text-sm">See your Games History</h2>
    //     </div>

    //   </div>
    // </Card>
  )
}

export default HistoryCard