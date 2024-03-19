'use client'
import React, { useEffect } from 'react';
import  MainHeader from './UI/MainHeader/MainHeader';
import { ReactNode } from 'react';
import { useAuthContext } from './state/auth-context';

interface LayoutProps {
  children: ReactNode;
}


 const Layout: React.FC<LayoutProps> = ({ children}) => {
  // const ctx = useAuthContext();
  // const isAuthenticated = true;
  // const {isAuthenticated , updateUserData} = useAuthContext();
  // ctx.updateUserData();
  // useEffect (() => {
  //     //('useeff');
  //     // ctx.updateUserData();
  //   }, []);
  // useEffect => () = ({!ctx.isAuthenticated? ctx.loadUserData()}, []);
  // //('layout user', ctx.user);
  // //('layout', ctx.isAuthenticated);
  
  return (
    <section>

      <MainHeader />
      {children}
    </section>
  
  );
};

export default Layout;
