// Import necessary dependencies and styles
'use client'
import React, { useEffect } from 'react';
import Card from '@/app/UI/Card/Card'; 
// import Button from '@/app/UI/Button/Button'; // Assuming you have a Button component
// import MainHeader from '@/app/UI/MainHeader/MainHeader';
import { useAuthContext } from '@/app/state/auth-context';
import Layout from '@/app/main_layout';
//import ParticleBackground from '@/app/UI/Particle/ParticleBackground';
import { Button } from "@/app/components/ui/button"
import Landing from '../Landing/page';
import { useRouter } from 'next/navigation';
import Registration from '../Registration/page';
// import { useState, useEffect } from 'react';
// import { useAuthContext } from '@/app/state/auth-context';
const Login: React.FC = () => {
  const ctx = useAuthContext();
  const router = useRouter();
  // const [show2fa, setShow2fa] = useState(false);
  // const ctx = useAuthContext();
  // const {isAuthenticated, } = useContext();
  const handle42Login = async () => {
    // //('url :', process.env.NEXT_PUBLIC_API_URL)
    // Check if process.env.NEXT_PUBLIC_API_URL is defined
    if (process.env.NEXT_PUBLIC_API_URL !== undefined) {
      // If defined, assign its value to apiUrl
      const apiUrl: string = process.env.NEXT_PUBLIC_API_URL + "/auth";
      // Use apiUrl to set window.location.href
      window.location.href = apiUrl;
    } else {
      // If process.env.NEXT_PUBLIC_API_URL is undefined, log an error
      console.error("NEXT_PUBLIC_API_URL is not defined");
    }
    // ctx.updateUserData();
  };
  // const route = useRouter();
  // //('authlogin :', ctx.isAuthenticated);
  useEffect(() => {
    // console.log(ctx.isAuthenticated);
    // if (ctx.user?.is2FA) {
    //   router.push('/2FA');
    if(ctx.isAuthenticated){
      router.push('/Landing');
    } 
  }, [ctx.isAuthenticated, ctx.user?.is2FA]);
    //   if (ctx.user?.is2FA) {
  //     route.push('/2FA');
  //   } else if (ctx.isAuthenticated) {
  //     route.push('/Landing');
  //   } else {
  //     route.push('/Login');
  //   }
  //   if(ctx.isAuthenticated){
  //     route.push('/Landing');
  //   }


  // //   if (
  // //     typeof window !== undefined &&
  // //     window.location.search.includes("2fa=true")
  // //   ) {
  // //     setShow2fa(true);
  // //   }
  // }, []);
  return (
        <Layout>
          <Card className="card shadow-xxl">
            {/* <div className="grid grid-rows-2 w-full"> */}
              <div className="flex items-center justify-center rounded-2xl z-20">
                <Button
                  className="absolute w-96 inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm 
                  font-medium text-backlight rounded-lg group bg-gradient-to-br from-backdark to-blue group-hover:from-blue 
                  group-hover:to-blue hover:text-pink dark:text-backlight focus:ring-4 focus:outline-none focus:ring-pink dark:focus:ring-blue"
                  // type="button"
                  onClick={() => handle42Login()
                  }
                >
                  {/* {ctx.isAuthenticated?<Registration title={"Sign in with 42"}></Registration>: */}
                  <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  Sign in with 42
                  </span>
                  {/* } */}
                </Button>
              </div>
          </Card>
        </Layout>
  );

};

export default Login;
