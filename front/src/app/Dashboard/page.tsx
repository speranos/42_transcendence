'use client'
// import React, { useContext } from 'react';
import MainHeader from '@/app/UI/MainHeader/MainHeader';
import Layout from '../main_layout';
import { Level, columns } from "@/app/level/columns";
// import { DataTable } from "@/app/Score/data-table" 
// import AuthContext, { AuthContextProvider } from '@/app/state/auth-context';

// import MainHeader from '../MainHeader/MainHeader';
// import AuthContext from '../state/auth-context';
// import Card from '@/UI/Card/Card';
// import UserState from '@/UI/userState/UserState';
import { DataTable } from '@/app/level/data-table';
// import { DataTablePagination } from '@/app/Score/pagination';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { MyCarousel } from '../components/ui/Carousel';
import { FolderKanban } from 'lucide-react';
// import { useState } from 'react';
import { useAuthContext } from '../state/auth-context';
// 'use client'
import { StringToBoolean } from 'class-variance-authority/types';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
// import Layout from '../main_layout';
// import Dashcard from '../UI/Dashcard/Dashcard';

interface User {
  isOnline : boolean;
  isInGame: boolean;
  isOwner: boolean;
  isFriend: boolean;
  id : string;
  userName: string;
  avatar: string;
  winrate: number;
  rank: number;
}

interface LeaderboardCardProps {
  online: boolean;
  ingame : boolean;
  owner: boolean;
  friend: boolean;
  key: string;
  id : string;
  username: string;
  avatar: string;
  winrate: number;
  rank: number;
}

export default function Dashboard() {
  const ctx = useAuthContext();
  const route = useRouter();
// const [hoveredItem, setHoveredItem] = useState(false); 
const accordionData = [
  {
    title: 'Experience Ping Pong Anytime, Anywhere',
    content: 'With our online ping pong game, you can enjoy the excitement of competitive play whenever and wherever you like. Whether you\'re at home, on the go, or taking a break at work, all you need is an internet connection to jump into a match and test your skills against players from around the world.',
    id: 'item-2',
  },
  {
    title: 'Welcome to Our Online Ping Pong Arena',
    content: 'Step into the exciting world of online ping pong! Our platform brings the fast-paced action and thrill of ping pong straight to your fingertips. Whether you\'re a seasoned pro or a beginner looking to hone your skills, you\'ll find everything you need to enjoy this classic game in a digital environment.',
    id: 'item-1',
  },
  {
    title: 'Connect with Players Worldwide!', // Example with repeated text
    content: 'Join a vibrant community of ping pong enthusiasts from all corners of the globe. Our online platform allows you to connect with players of all skill levels, from casual players looking for a friendly match to competitive players seeking a challenge. With our intuitive matchmaking system, you\'ll always find opponents who match your skill level for a fair and exciting game.',
    id: 'item-3',
  },
];
    const [userData, setUserData] = useState<User[]>([]);

    useEffect(() => {
      // if(!ctx.user){
      //   route.push('Login');
      // }
        const fetchData = async () => {
            try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leaderboard/data`, {
                credentials: "include",
            });
            const data: User[] = await response.json();
            setUserData(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchData();
    }, []);

    const gologin = () => {
      route.replace('/');
    }
  
    if(!ctx.isAuthenticated){
      return <Layout><div className='flex items-center justify-center text-gradient p-20 underline'>unknown user, Please Log In Again
  <div className='w-10'></div><Button className='flex items-center justify-center text-gradient  underline border border-solid border-blue px-20' onClick={gologin}>To Login Page</Button>
  </div></Layout>;
    }
    // const addFriend = async (userid: any) => {
    //   try {
    //     const api = 'http://localhost:3000/friendship/send-request/' + userid;
    //       const response = await fetch(api, {
    //         credentials: 'include',
    //           method: 'POST',
    //           headers: {
    //               'Content-Type': 'application/json'
    //           }
    //       });
    //       const data = await response.body;
    //   } catch (error) {
    
    //       console.error('Error adding friend:', error);
    //   }
    // };

return (
  <Layout >
    <div className="bg-backdark bg-fixed bg-cover bg-center h-full">

      <section className="mx-auto max-w-7xl p-8">

        <div className="grid grid-cols-1 gap-8 mt-4">
          <div className="col-span-2">
            <div className="bg-white p-8 rounded-xl shadow-md text-3xl font-roboto text-center">
              <h2 className="text-gradient">Players Ranking</h2>
              <div className="flex justify-center items-center">
                <DataTable columns={columns} data={userData} />
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="p-8 rounded-xl text-backlight ">

            <h2 className="text-2xl font-bold mb-4 text-center text-gradient">Game</h2>
            {accordionData.map((item) => (
              <Accordion key={item.id} type="single" collapsible>
                <AccordionItem value={item.id}>
                  <AccordionTrigger
                    className="border-b py-6 text-backlight relative"
                  >
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent className="py-2">{item.content}</AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
          <div className="p-8 pt-24">
            <h2 className="text-2xl font-bold mb-4 text-center text-gradient">designed by salam</h2>
          </div>
        </div>
      </section>
    </div>
  </Layout>
);
};

          

            



// // <Layout isAuthenticated={true}>
// //   <section className="mx-auto max-w-7xl pb-8 bg-lightblue">

// //     <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4 p-4">
// //       <div className="grid grid-rows-2 gap-12 sm:grid-cols-1">
// //         <div className="relative">
// //           <div className="text-center p-10">
// //             {accordionData.map((item) => (
// //               <Accordion key={item.id} type="single" collapsible>
// //                 <AccordionItem value={item.id}>
// //                   <AccordionTrigger>{item.title}</AccordionTrigger>
// //                   <AccordionContent>{item.content}</AccordionContent>
// //                 </AccordionItem>
// //               </Accordion>
// //             ))}
// //           </div>
// //         </div>
// //         <div className="relative sm:m-8">
// //           <h1 className="text-center font-bold">Best Players</h1>
// //           <div className="flex items-center justify-center">
// //               <MyCarousel />
// //             </div>
// //         </div>
// //       </div>
// //       <div className="relative col-span-2 sm:mt-8 w-full rounded-xl ">
// //         <div className="text-center justify-center">
// //           <DataTable columns={columns} data={data}></DataTable>
// //         </div>
// //       </div>
// //     </div>
// //   </section>
// // </Layout >

// // export default Dashboard;





// 'use client'
// import { StringToBoolean } from 'class-variance-authority/types';
// import React, { useState, useEffect } from 'react';
// import Layout from '../main_layout';

// interface User {
//   isOnline : boolean;
//   isInGame: boolean;
//   isOwner: boolean;
//   isFriend: boolean;
//   id : string;
//   userName: string;
//   avatar: string;
//   winrate: number;
//   rank: number;
// }

// interface LeaderboardCardProps {
//   online: boolean;
//   ingame : boolean;
//   owner: boolean;
//   friend: boolean;
//   key: string;
//   id : string;
//   username: string;
//   avatar: string;
//   winrate: number;
//   rank: number;
// }

// const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ online, ingame, owner, friend, id, username, avatar, winrate, rank }) => (
//   <div className="max-w-xl mx-auto bg-blue shadow-lg rounded-lg overflow-hidden flex items-center h-42 mb-4">
//     <img className="h-full w-32 object-cover" src={avatar} alt={username} />
//     <div className="flex-1 px-4 py-2">
//       <h3 className="text-backlight font-semibold">{username}</h3>
//       <p className="text-backlight">{`Winrate: ${winrate}` + '%'}</p>
//       <p className="text-backlight">{`Rank: ${rank}`}</p>
//       {ingame && <p style={{ color: 'orange' }}>Ingame</p>}
//       {online && <p style={{ color: 'green' }}>Online</p>}
//       {!online && <p style={{ color: 'red' }}>Offline</p>}
//       {!owner && !friend && <button className="text-pink font-semibold" onClick={() => addFriend(id)}>Add Friend</button>}
//     </div>
//   </div>
// );

// const addFriend = async (userid: any) => {
//   try {
//     const api = 'http://localhost:3000/friendship/send-request/' + userid;
//       const response = await fetch(api, {
//         credentials: 'include',
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json'
//           }
//       });
//       const data = await response.body;
//   } catch (error) {

//       console.error('Error adding friend:', error);
//   }
// };
//   const LeaderboardPage: React.FC = () => {
//     const [userData, setUserData] = useState<User[]>([]);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//             const response = await fetch('http://localhost:3000/leaderboard/data', {
//                 credentials: "include",
//             });
//             const data: User[] = await response.json();
//             setUserData(data);
//             } catch (error) {
//                 console.error('Error fetching user data:', error);
//             }
//         };
//         fetchData();
//     }, []);

//   return (
//     <Layout>

//     <div className="leaderboard bg-backdark h-screen">
//       {userData.map(user => (
        
//         <li className="p-5 text-backlight">
//         <LeaderboardCard
//         owner={user.isOwner}
//         friend={user.isFriend}
//         key={user.id}
//           id={user.id}
//           username={user.userName}
//           avatar={user.avatar}
//           winrate={user.winrate}
//           rank={user.rank}
//           online={user.isOnline}
//           ingame={user.isInGame}
//           />
//           </li>
//           ))
//           }
//     </div>
//           </Layout>
//   );
// };

// export default LeaderboardPage;
