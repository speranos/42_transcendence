
import React, { useEffect } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/app/state/auth-context";
import { useRouter } from "next/navigation";

interface GameRequest{
  requestID: string;
  senderID: string;
  senderUsername: string;
  senderavatar: string;
  requestType: string;
  creationId: string;
}


interface game{
  name : string;
  userId : string;
  requestId : string;
}

export function GamePopup({game }: {game : game}) {
  const ctx = useAuthContext();
  const route = useRouter();
  
  const handleacc = async () => {
    if(ctx.socket){
      ctx.socket.emit("accept request", game.userId, game.requestId);
      ctx.socket.on("accept game request", (gameid) =>{
        route.push('/gamevip/' + gameid);
      }
      )
    }

  };
     
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Show Dialog</Button>
        </AlertDialogTrigger>
        <AlertDialogContent  className="backdrop-blur-lg border border-solid border-blue ">
          <AlertDialogHeader>
            <AlertDialogTitle>Game Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you absolutely sure?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick ={handleacc}>Accept</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }
  