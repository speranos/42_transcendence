import { useAuthContext } from "@/app/state/auth-context";
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface userData {
    requestID: string;
    senderID: string;
    senderUsername: string;
    senderavatar: string;
    requestType: string;
    creationId: string;
}
interface userData1 {
    requestID: string;
    senderID: string;
    senderUsername: string;
    senderavatar: string;
    requestType: string;
    creationId: string;
}
// function RequestCard(senderavatar: string, senderusername: string) {
function RequestCard({ user }: { user: userData }) {
    const route = useRouter()
    const addFriend = async () => {
        try {
            const api = `${process.env.NEXT_PUBLIC_API_URL}/friendship/accept-request/` + user.requestID;
            const response = await fetch(api, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.body;
            window.location.reload();
        } catch (error) {
            console.error('Error adding friend:', error);
        }
    };
    const refusefriend = async () => {
        try {
            const api = `${process.env.NEXT_PUBLIC_API_URL}/friendship/decline-request/` + user.requestID;
            const response = await fetch(api, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.body;
            window.location.reload();
        } catch (error) {
            console.error('Error adding friend:', error);
        }
    };

    return (
        <div className="flex shadow-blue   border border-solid border-blue p-4 rounded-lg w-full">
            <section className="flex flex-col justify-between rounded-lg w-full">
                <div className="flex items-center">
                    <div className="w-1/2 h-full border-separate border-y-blue">
                        <img src={`${user?.senderavatar}`} alt="avatar" className="bg-pink h-8 w-8 rounded-full" />
                        <h1 className="pt-4 text-xl text-lavender">{user.senderUsername}</h1>
                    </div>
                    <div className="ml-4 w-full">
                        <h1 className="text-lg  block text-lavender font-bold">Friend Request</h1>
                        <div className="flex justify-end mt-4">
                            <button className="mr-2 px-4 py-2 text-lavender rounded-md border border-solid border-blue"
                                onClick={addFriend}>
                                Accept
                            </button>
                            <button className="px-4 py-2 text-lavender rounded-md border border-solid border-blue"
                                onClick={refusefriend}>
                                Decline
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

function GameCard({ user }: { user: userData1 }) {
    const route = useRouter()
    const addFriend1 = async () => {
        try {
            const api = `${process.env.NEXT_PUBLIC_API_URL}/game/accept-request/` + user.requestID;
            const response = await fetch(api, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.text();
            route.push('/gamevip/' + data);
        } catch (error) {
            console.error('Error adding friend:', error);
        }
    };
    const refusefriend1 = async () => {
        try {
            const api = `${process.env.NEXT_PUBLIC_API_URL}/game/decline-request/` + user.requestID;
            const response = await fetch(api, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.body;
            window.location.reload();
        } catch (error) {
            console.error('Error adding friend:', error);
        }
    };

    return (
        <div className="flex shadow-blue   border border-solid border-blue p-4 rounded-lg w-full">
            <section className="flex flex-col justify-between rounded-lg w-full">
                <div className="flex items-center">
                    <div className="w-1/2 h-full border-separate border-y-blue">
                        <img src={`${user?.senderavatar}`} alt="avatar" className="bg-pink h-8 w-8 rounded-full" />
                        <h1 className="pt-4 text-xl text-lavender">{user.senderUsername}</h1>
                    </div>
                    <div className="ml-4 w-full">
                        <h1 className="text-lg  block text-lavender font-bold">Game request</h1>
                        <div className="flex justify-end mt-4">
                            <button className="mr-2 px-4 py-2 text-lavender rounded-md border border-solid border-blue"
                                onClick={addFriend1}>
                                Accept
                            </button>
                            <button className="px-4 py-2 text-lavender rounded-md border border-solid border-blue"
                                onClick={refusefriend1}>
                                Decline
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export function Dropdown() {
    const [userData, setUserData] = useState<userData[] | null>([]);
    const [gameData, setgameData] = useState<userData[] | null>([]);
    const ctx= useAuthContext();


    // useEffect(() => {
    const fetchData = async () => {
        try {
            // //('userdata', userData);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/requests/friendship/recv`, {
                credentials: "include",
            });
            const data: userData[] = await response.json();
            setUserData(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };
    
      const GameData = async () => {
          try {
            // //('userdata', userData);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/requests/game/recv`, {
                credentials: "include",
            });
            const data: userData[] = await response.json();
            setgameData(data);
        } catch (error) {
            console.error('Error fetching game request:', error);
        }
    };
    useEffect(() => {
        if(ctx.isAuthenticated){

            
            fetchData();
            GameData();
        }
      }, [ctx]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" onClick={() => { fetchData(); GameData(); }}>
                    <svg fill="#F7F5F3" width="24px" height="24px" xmlns="http://www.w3.org/2000/svg"><path
                    d="M10,20h4a2,2,0,0,1-4,0Zm8-4V10a6,6,0,0,0-5-5.91V3a1,1,0,0,0-2,0V4.09A6,6,0,0,0,6,10v6L4,18H20Z" /></svg>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="inline-block backdrop-blur-lg w-80 text-center font-bold mt-1 border-blue border-t-0 text-gradient rounded-none">
                <h1 className="text center w-full">My requests</h1>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem >
                        <div className="grid grid-flow-row-dense items-center justify-center w-full">

                            {userData && userData.length && userData?.map(user => (
                                <DropdownMenuItem key={user.requestID}>
                                    <RequestCard user={user} />
                                </DropdownMenuItem>
                            ))}
                            {gameData && gameData.length && gameData?.map(gameuser => (
                                <DropdownMenuItem key={gameuser.requestID}>
                                    <GameCard user={gameuser} />
                                </DropdownMenuItem>
                            ))}
                        </div>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
