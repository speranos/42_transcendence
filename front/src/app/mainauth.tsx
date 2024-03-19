'use client';
import React, { useEffect , useState} from 'react';
import { useAuthContext } from './state/auth-context';
import { useRouter } from 'next/navigation';

export default function  Main_auth () {
  // const ctx = useAuthContext();
  const router = useRouter();
  // //('mainauth 2fa', ctx.user?.is2FA)

  useEffect(() => {
      router.push('/Login');
  }, []);


  return (
    <main> 
    </main>
  );
}