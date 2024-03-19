import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

import React from 'react'
import Card from "../Card/Card"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { tryGetJson } from "@/app/utils/json"

interface User {
    avatar: string;
    userName: string;
    userID: string;
}

function BlockedCard({ user }: { user: User }) {
    const route = useRouter();
    const UnblockUser = async () => {
        try {
            const api = `${process.env.NEXT_PUBLIC_API_URL}/profile/unblockfriend/` + user?.userID;
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
            console.error('Error blocking friend:', error);
        }
    };

    return (
        <div className="grid grid-cols-3 items-center justify-center">

            {/* <Card className="grid grid-cols-3"> */}
            <div className="block">
                <img src={user?.avatar} className="relative rounded-lg h-12 w-12" />

            </div >
            <div className="block text-xl font-bold leading-tight">{user?.userName}</div>
            <div className="block">
                <DrawerClose asChild>
                    {/* <Button variant="outline">Cancel</Button> */}
                    <Button onClick={UnblockUser} className="block border-backlight border-solid">
                        Unblock
                    </Button>
                </DrawerClose>
            </div>
            {/* </Card> */}
        </div>
    )
}

// export default BlockedCard

export function BlockedDrawer() {
    const [Users, setUsers] = useState<User[] | null>([]);

    const Blockedlist = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/blockedfriends`, {
                credentials: "include",
            });
            const data: User[] = await tryGetJson(response) as User[];
            setUsers(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
        //('blocked', Users);
    };

    // fetchData();

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="outline" onClick={Blockedlist}>Show blocked list</Button>
            </DrawerTrigger>
            <DrawerContent className="backdrop-blur-sm border  border-t-backlight ">
                <div className="mx-auto w-full max-w-sm text-gradient">
                    <DrawerHeader>
                        <DrawerTitle>Blocked List</DrawerTitle>
                        <DrawerDescription>unblock users here.</DrawerDescription>
                    </DrawerHeader>

                    {Users && Users.map(blocked => (
                            <BlockedCard user={blocked} />
                        ))
                    }
                    <DrawerFooter>
                        {/* <Button>Unblock</Button> */}
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer >
    )
}
