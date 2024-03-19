'use client'
import { useState } from "react"
import { useEffect } from "react"
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
import M_fetch from "@/app/utils/M_fetch"
import { useAuthContext } from "@/app/state/auth-context"
import Link from "next/link"
import Router, { useRouter } from "next/navigation"
import { tryGetJson } from "@/app/utils/json"

interface User {
  id: string;
  username: string;
  // other user details
}

interface Friendship {
  userID: string;
  userName: string;
  userAvatar: string;
  isOnline: boolean,
  isInGame: boolean,
}

interface FriendsProps {
  id: string;
}




const Friends: React.FC<FriendsProps> = ({ id }) => {

  const [friends, setFriends] = useState<Friendship[] | null>(null);
  const route = useRouter();
  // const ctx = useAuthContext();

  useEffect(() => {
    // //('name', name)

    const Freindlist = async () => {
    try {
      const resp = await M_fetch.get(`/profile/friendslist/${id}`, {credentials: "include"});
      if (resp.status === 200) {
        const data: Friendship[] = await tryGetJson(resp) as Friendship[];
          setFriends(data);

        } else {
          console.error('bad response');
        }
    } catch (error) {
      console.error('Error loading friends:', error);
    }
  };
  Freindlist();
  }, []);

  const handleAvatarClick = (friendname: string) => {
    if(friendname){
      route.push(`/Profile/${friendname}`)
    }
  };



  return (
    <Card className="w-64  h-72  shadow text-backlight shadow-backlight">
      <CardHeader>
        <CardTitle>Friends</CardTitle>
        <CardDescription>
          Invite your friends to play.
        </CardDescription>
      </CardHeader>
      <div className="relative scroll-content">

      <CardContent className="grid gap-6 w-full">
        {friends && friends?.map((friend) => (
          <div key={friend.userID} className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              {/* <a href="redirection profile" onClick={() => handleAvatarClick(friend.userID)}> */}
              {friend.userAvatar && <a onClick={() => handleAvatarClick(friend.userID)}>
                <img src={friend.userAvatar} className="h-8 w-8 rounded-full"/>
              </a>}
              {/* </a> */}
             
              <div>
                <ul>
                  <li>{friend.userName}</li>
                </ul>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
        </div>
    </Card>
  );
};


export { Friends }