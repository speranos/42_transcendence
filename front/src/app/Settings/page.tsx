'use client'
import React, { useEffect } from 'react'
import Layout from '../main_layout'
import Registration from '../Registration/page'
import Lottie from 'lottie-react';
import animationData from '@/../public/settings_anim.json'
import { useAuthContext } from '../state/auth-context';
import { BlockedDrawer } from '../UI/BlockedDrawer/BlockerDrawer';
import { GamePopup } from '../UI/GamePopup/GamepPopup';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const Settings = () => {
  const ctx = useAuthContext();
  const route = useRouter();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

  const gologin = () => {
    route.replace('/');
  }

  if(!ctx.isAuthenticated){
    return <Layout><div className='flex items-center justify-center text-gradient p-20 underline'>unknown user, Please Log In Again
    <div className='w-10'></div><Button className='flex items-center justify-center text-gradient  underline border border-solid border-blue px-20' onClick={gologin}>To Login Page</Button>
    </div></Layout>;
  }

  return (
    <Layout >
      <div className="flex justify-center items-center min-h-screen  bg-backdark">
        <div className="max-w-7xl">
          <div className="grid grid-cols-2 ">
            <div className="containers">
              <div className="block pb-8 font-bold text-5xl text-gradient text-center">
                <h1 className="font-bold text-5xl text-gradient">
                  Settings
                </h1>
              </div>
              <Lottie animationData={animationData}
              className="z-0 hidden md:block"/>
            </div>
            <div className="w-1/2 mt-8 inline items-center justify-center h-2/3">
              <div className="m-3 text-backlight">
                <Registration title='Edit Profile' />
              </div>
              <div className="m-3 text-backlight">
                <BlockedDrawer></BlockedDrawer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Settings