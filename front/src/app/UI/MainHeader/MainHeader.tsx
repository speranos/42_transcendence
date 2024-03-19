import React, { useEffect } from 'react';

import Navigation from './Navigation';
import { useAuthContext } from '@/app/state/auth-context';



const MainHeader: React.FC = () =>{

  const ctx = useAuthContext();
  // const {isAuthenticated} = true;
  useEffect(() =>{
    const fetchUserData = async () => {
      if(ctx.isAuthenticated){
        await ctx.updateUserData();
      }
    }
    fetchUserData()
  },[ctx.isAuthenticated])

  useEffect(() => {
    if (ctx.isAuthenticated && !ctx.socket) {
      if(ctx.user) ctx.initializeSocket(ctx.user.userID);
    }
  
    return () => {
      // if (socketRef.current) {
      //   socketRef.current.disconnect();
      // }
    };
  }, [ctx.isAuthenticated, ctx.socket]);
  // //('mainheader :', ctx.isAuthenticated);
  return (

    <header  className='debug'>
      <Navigation />
    </header>
  );
};

export default MainHeader;