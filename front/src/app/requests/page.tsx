'use client'
import { StringToBoolean } from 'class-variance-authority/types';
import React, { useState, useEffect } from 'react';
import Layout from '../main_layout';
import Link from 'next/link';

interface User {
  requestID : string;
  senderID: string;
  senderUsername: string;
  senderavatar: string;
  requestType: string;
  creationId: string;
}

interface LeaderboardCardProps {
  key: string;
  id : string;
  username: string;
  avatar: string;
  type: string;
  creationid: string;
}

interface LeaderboardProps {
  userData : User[];
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ type, id, username, avatar}) => (
    <div className="max-w-xl mx-auto bg-blue-500 shadow-lg rounded-lg overflow-hidden flex items-center h-20 mb-4">
    <img className="h-full w-32 object-cover" src={avatar} alt={username} />
    <div className="flex-1 px-4 py-2">
      <h3 className="text-white font-semibold">{username}</h3>
    </div>
    <div className="flex-1 px-4 py-2">
      {type && <button className="text-white font-semibold" onClick={() => addFriend(id)}>Accept</button>}
    </div>
    <div className="flex-1 px-4 py-2">
      {type && <button className="text-white font-semibold" onClick={() => refusefriend(id)}>Decline</button>}
    </div>
    {/* <div className="flex-1 px-4 py-2">
      {!type && <button className="text-white font-semibold" onClick={() => acceptgame(id)}>Accept game</button>}
    </div>
    <div className="flex-1 px-4 py-2">
      {!type && <button className="text-white font-semibold" onClick={() => refusegame(id)}>Decline</button>}
    </div> */}
  </div>
);

const addFriend = async (userid: any) => {
  try {
    const api = `${process.env.NEXT_PUBLIC_API_URL}/friendship/accept-request/` + userid;
      const response = await fetch(api, {
        credentials: 'include',
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          }
      });
      const data = await response.body;
      // <Link href="../gamevip/page"></Link>
  } catch (error) {
    console.error('Error adding friend:', error);
  }
};
const refusefriend = async (userid: any) => {
  try {
    const api = `${process.env.NEXT_PUBLIC_API_URL}/friendship/decline-request/` + userid;
      const response = await fetch(api, {
        credentials: 'include',
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          }
      });
      const data = await response.body;
  } catch (error) {
    console.error('Error adding friend:', error);
  }
};

// const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ online, ingame, owner, friend, id, username, avatar, winrate, rank }) => (
//     <div className="max-w-xl mx-auto bg-blue shadow-lg rounded-lg overflow-hidden flex items-center h-42 mb-4">
//       <img className="h-full w-32 object-cover" src={avatar} alt={username} />
//       <div className="flex-1 px-4 py-2">
//         <h3 className="text-backlight font-semibold">{username}</h3>
//         <p className="text-backlight">{`Winrate: ${winrate}` + '%'}</p>
//         <p className="text-backlight">{`Rank: ${rank}`}</p>
//         {ingame && <p style={{ color: 'orange' }}>Ingame</p>}
//         {online && <p style={{ color: 'green' }}>Online</p>}
//         {!online && <p style={{ color: 'red' }}>Offline</p>}
//         {!owner && !friend && <button className="text-pink font-semibold" onClick={() => addFriend(id)}>Add Friend</button>}
//       </div>
//     </div>
//   );

const Leaderboard: React.FC<LeaderboardProps> = ({ userData }) => {
  const leaderboardItems: JSX.Element[] = [];
  if (!userData.length){
    return;
  }
  // else{
  

    for (let i =0; i != userData.length; i++) {
      leaderboardItems.push(
        <LeaderboardCard
        key={userData[i].requestID}
        id={userData[i].requestID}
        username={userData[i].senderUsername}
        avatar={userData[i].senderavatar}
        type={userData[i].requestType}
        creationid={userData[i].creationId}
        />
        );
      }
    
      // }
    
    return userData?<div className="leaderboard">{leaderboardItems}</div>:
    <div className="text-backdark flex items-center justify-center"> no result</div>;
};

  const RequestList: React.FC = () => {
    const [userData, setUserData] = useState<User[]>([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/requests/friendship/recv`, {
                    credentials: "include",
                });
                const data: User[] = await response.json();
                setUserData(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
        //('userdata', userData);
    }, []);


  return(
    <Layout>
      {/* <Leaderboard userData={userData}></Leaderboard> */}
    <div className="leaderboard">
      {Array.isArray(userData) && userData.map(user => (
        <LeaderboardCard
          key={user.requestID}
          id={user.requestID}
          username={user.senderUsername}
          avatar={user.senderavatar}
          type={user.requestType}
          creationid={user.creationId}
        />
      ))
      }
    </div>
    </Layout>
  );
};

export default RequestList;
