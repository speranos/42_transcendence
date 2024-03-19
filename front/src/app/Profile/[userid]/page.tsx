'use client'
import React, { useEffect, useState } from 'react'
import Layout from '@/app/main_layout'
import { Friends } from '@/app/UI/Friends/Friends';
import HistoryCard from '@/app/UI/History/HistoryCard';
import { useAuthContext } from '@/app/state/auth-context';
// import { useRouter } from 'next/navigation';
import { usePathname, useRouter } from 'next/navigation'
import M_fetch from '@/app/utils/M_fetch';
import { Button } from '@/components/ui/button';
import { Avatar } from '@radix-ui/react-avatar';
import { AvatarImage } from '@/components/ui/avatar';
import { tryGetJson } from '@/app/utils/json';

interface achievements {
  userID: string;
  achievementID: string;
  description: string;
  prizeImg: string;
  time: Date;
}

interface SVGProps {
  list: achievements[],
}

const SvgList: React.FC<SVGProps> = ({ list }) => {
  if (!Array.isArray(list)) {
    return null;
  }
  return (
    <div className="flex items-center justify-center space-x-8">
      {list.map((achiev) => (
        <img
          key={achiev.achievementID}
          src={achiev.prizeImg}
          alt={`svg-${achiev.description}`}
          className="h-16 w-16 p-2" // Adjust the size as needed
        />
      ))}
    </div>
  );
};

interface User {
  userID: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  WinRate: number;
  isOwner: Boolean;
  isFriend: Boolean;
  isFriendReq: Boolean;
  isOnline: Boolean;
  isInGame: Boolean;
}

const Profile: React.FC = () => {
  // const route = useRouter();
  const ctx = useAuthContext();
  const route = useRouter();

  const [user, setuser] = useState<User | null>(null);
  const [achievements, setachievements] = useState<achievements[] | null>(null);
  const currentUrl = usePathname();
  const id = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);
  // const match = currentUrl.match(/\/([^\/]+)$/); // Match the last part after the last "/"
  // const name = match ? match[1] : ""; // Get the captured group
  // //('name', name);


  const getUser = async () => {
    try {
      //('id ', id);
      const resp = await M_fetch.get(`/profile/data/${id}`, {});
      if (resp.status === 200) {
        const data: User = await resp.json();
        if (data) {
          // data.userAvatar = `http://localhost:3000${user?.userAvatar ?? ''}`; 
          setuser(data);
        }
      } else {
        console.error('bad response');
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
    //('profile user', user)
  };

  const addFriend = async () => {
    try {
      //('request');
      const api = `${process.env.NEXT_PUBLIC_API_URL}/friendship/send-request/` + user?.userID;
      const response = await fetch(api, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.body;
      getUser();
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const blockFriend = async () => {
    try {
      //('request');
      const api = `${process.env.NEXT_PUBLIC_API_URL}/friendship/blockfriendship/` + user?.userID;
      const response = await fetch(api, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.body;
      getUser();
      window.location.reload();
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const deleteFriend = async () => {
    try {
      //('request');
      const api = `${process.env.NEXT_PUBLIC_API_URL}/profile/deletefriend/` + user?.userID;
      const response = await fetch(api, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.body;
      getUser();
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const getSVG = async () => {
    try {
      const api = `${process.env.NEXT_PUBLIC_API_URL}/profile/achievements/${id}`;
      const resp = await fetch(api, {
        credentials: 'include',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (resp.status === 200) {
        const data: any = await tryGetJson(resp);
        setachievements(data);
      } else {
        console.error('bad response');
      }
    } catch (error) {
      console.error('Error loading achivements:', error);
    }
  };
  useEffect(() => {
    // if(!ctx.isAuthenticated){
    //   route.push('/Login');
    // }
    if (!user) {
      getUser();
      getSVG();
    }
  }, [user]);

  const gologin = () => {
    route.replace('/');
  }

  if(!ctx.isAuthenticated){
    return <Layout><div className='flex items-center justify-center text-gradient p-20 underline'>unknown user, Please Log In Again
    <div className='w-10'></div><Button className='flex items-center justify-center text-gradient  underline border border-solid border-blue px-20' onClick={gologin}>To Login Page</Button>
    </div></Layout>;
  }
  // 
  //('user avatar', user?.userAvatar);
  // //('user achievements ', achievements);
  return (
    <Layout>
      {/* <div>{username}</div> */}
      {!user && <div className="bg-backdark bg-fixed bg-cover bg-center h-screen text-gradient text-center flex justify-center items-center">loading user data maybe you are blocked</div>}
      <div className="bg-backdark bg-fixed bg-cover bg-center h-full">

        <div className="mx-auto max-w-7xl plr-4 pb-8">
          <div className="relative w-full z-0 pb-44">
            <div className="h-64 bg-gradient-to-r from-backdark to-lavender rounded-3xl">
              <img src="" alt="" />
            </div>
            <div className="absolute z-50 w-full top-56 pl-4 text-backlight">
              <div className="inline-flex w-full">


                <img
                  className="h-16 w-16 rounded-full"
                  src={user?.userAvatar}
                />



                {user?.isOnline ? <div className="bg-green rounded-full w-2 h-2"></div> : <div className="bg-red rounded-full w-2 h-2"></div>}
                <div className="text-extrabold w-full space-y-3 border-b-2 pl-6 pb-6 border-backlight">
                  <h1 className=" inline-block text-pretty text-2xl z-50 backdrop-opacity-10 text-gradient"> {user?.userName}
                  </h1>
                  <h2 className="text-lg tracking-tight">Email: {user?.userEmail}</h2>
                  <h2 className="text-lg tracking-tight">Win Rate: {user?.WinRate}</h2>
                </div>
                <div className="grid grid-rows-2 items-center pt-8">
                  <div className=' w-full'>

                    {!user?.isOwner && !user?.isFriend && !user?.isFriendReq &&
                      // <a href="addFriend" onClick={addFriend}>
                      <Button className="items-center justify-center p-4 me-2 w-32
                  font-medium text-backlight rounded-lg group bg-gradient-to-tl from-backdark to-blue group-hover:from-blue "
                        onClick={addFriend}
                      > Add Friend</Button>
                      // </a>
                    }
                    {!user?.isOwner && user?.isFriend && !user?.isFriendReq &&
                      // <a href="addFriend" onClick={addFriend}>
                      <Button className="items-center justify-center p-4 me-2 w-32
                  font-medium text-backlight rounded-lg group bg-gradient-to-tl from-backdark to-blue group-hover:from-blue "
                        onClick={deleteFriend}
                      > Unfriend</Button>
                    }
                    {!user?.isOwner && user?.isFriendReq && <div className="whitespace-nowrap overflow-hidden overflow-ellipsis text-pretty text-right text-gradient">
                      request pending
                    </div>
                    }
                  </div>
                  <div className='w-full'>
                    {user?.isFriend && !user?.isOwner && <Button className="items-center justify-center p-4 me-2 w-32
                  font-medium text-backlight rounded-lg group bg-gradient-to-tl from-backdark to-blue group-hover:from-blue"
                  onClick={blockFriend}> Block
                    </Button>}
                  </div>
                </div>


              </div>
            </div>
          </div>
          {/* cards */}
          {/* <div className="relative"> */}
          {/* <div className="grid grid-rows-2 top-0"> */}
          <div className="grid grid-rows-1 sm:grid-cols-2 ">
            <div className="flex items-center justify-center mb-10">
              {user?.userID && <Friends id={user?.userID} />}
            </div>
            <div className="flex items-center justify-center w-full mb-10">
              {/* <span className="block text-2xl top-0">Games History:</span>  */}
              {user?.userID && <HistoryCard id={user?.userID} />}
              {/* <HistoryCard /> */}
            </div>
          </div>
          <div className="flex h-36 p-4">
            <div className="grid grid-rows-1 sm:grid-rows-2 shadow-lg rounded-2xl z-20 w-full">
              <div className="block text-center w-full">
                <span className="w-full text-2xl font-bold text-backlight p-4">Achievements :</span>
              </div>
              <div className="h-12 inline-flex w-full justify-center">
                {achievements && <SvgList list={achievements} />}
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
        {/* </div> */}
      </div>
    </Layout>
  )
}

export default Profile;