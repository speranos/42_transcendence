import React, { useEffect } from 'react';
import Main_auth from './mainauth';
import { useAuthContext } from './state/auth-context';
import { useRouter } from 'next/navigation';
//HERE!
export default function Page() {
  return (
      <Main_auth/>
  );
}