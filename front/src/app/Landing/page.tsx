'use client'
import React  from 'react'
import Button from '@/app/UI/Button/Button'
import { AuthContextProvider } from '@/app/state/auth-context';
import Layout from '@/app/main_layout';
import Lottie from 'lottie-react';
import animationData from '@/../public/Animation - 1707316948712.json'
import { useAuthContext } from '../state/auth-context';
import { NextPageContext } from "next";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CarTaxiFront } from 'lucide-react';

// interface LandingProps {
  // isAuthenticated: boolean;
// }

export default function Landing() {

  // //('here');
  const ctx = useAuthContext();
  const route = useRouter();
  // const ctx = useAuthContext();
  // useEffect(() =>{

  //   if(!ctx.isAuthenticated){
  //     route.replace('/');
  //   }
  // },[ctx.isAuthenticated])
  const handleButtonClick = () => {
    route.push('/classic');
  };
  const handleButtonClick1 = () => {
    route.push('/Wtf');
  };

  const gologin = () => {
    route.replace('/');
  }

  if(!ctx.isAuthenticated){
    return <Layout><div className='flex items-center justify-center text-gradient p-20 underline'>unknown user, Please Log In Again
    <div className='w-10'></div><Button className='flex items-center justify-center text-gradient  underline border border-solid border-blue px-20' onClick={gologin}>To Login Page</Button>
    </div></Layout>;
  }
  // };
  // //('inside landing a batal ', ctx.isAuthenticated);
    // if(!ctx.isAuthenticated)
    //   route.push('/Login');
    // //('user at landing', ctx.user);
    // useEffect(() => {
    //   if(!ctx.user){
      // route.push('/Landing');
      
      //   }
      // }, []);

  return (
    // <AuthContextProvider>

    <Layout>
      <div className="flex items-center justify-center bg-backdark bg-fixed bg-cover bg-center h-full">
        <div className="max-w-7xl w-full p-4 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
            <section className="items-center p-10  flex">
              <div className="font-black text-center">
                <h1 className="text-gradient text-3xl pb-10">
                  Embark on the epic journey to ignite the showdown.
                </h1>
                <div className="text-2xl p-11 hidden lg:block text-lavender">
                  <span>Serve, Spin, Smash! Dive into the fast-paced world of ping pong. Unleash your inner champion and dominate the table!</span>
                </div>
              </div>
            </section>
            <div className="flex items-center justify-center">
              <div className="hidden lg:block lg:absolute inset-38 z-0">
                <Lottie animationData={animationData} />
              </div>
              <div className="grid grid-rows-2">

              <Button
                className="relative  bg-lavender py-2 px-24 border rounded-2xl hover:bg-blue text-backdark font-bold "
                onClick={handleButtonClick}
                type='button'
              >
                <span>
                  Play CLassic
                </span>
              </Button>
              <div className="h-4"></div>
              <Button
                className="relative  bg-lavender py-2 px-24 border rounded-2xl hover:bg-blue text-backdark font-bold "
                onClick={handleButtonClick1}
                type='button'
              >
                <span>
                  WTF :V
                </span>
              </Button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </Layout >
  )
}

// // export default Landing

// // export default Main_auth;

// /*
//  * Note:
//  * For the initial page load, this will run on the server only.
//  * And will then run on the client when navigating to a different
//  * route via the next/link component or by using next/router
//  * */
// Landing.getInitialProps = async (ctx: NextPageContext) => {
//   //   /*
//   //    * We are assuming that the user is already logged in
//   //    * if it has an Authentication cookie, so we redirect him to the home page.
//   //    * And in case the cookie is not valid, the server will delete it
//   //    * and redirect the user to the login page.
//   //    * */
  
//     if (!ctx.res) {
//       // throw new Error("Server-side only");
//       return {};
//     }
//     if (
//       ctx?.req?.headers?.cookie?.includes("Authentication")
//       // !ctx?.req?.headers?.["2fa"] === "true"
//      ) {
//       ctx.res.writeHead(303, { Location: "/Landing" });
//       ctx.res.end();
//     }
  
//     return {};
//   };