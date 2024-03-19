'use client'
import React, { useState, useEffect } from 'react';
import Button from '../UI/Button/Button';
// import './TwoFA.css'
import { Input } from '../components/ui/input';
import Card from '../UI/Card/Card';
import { useRouter } from 'next/navigation';
import M_fetch from '../utils/M_fetch';
import { useAuthContext } from '../state/auth-context';

const TwoFactorAuth = () => {
  const [qrUrl, setQrUrl] = useState('');
  const [code, setVerificationCode] = useState('');
  const [success, setSuccess] = useState(false);
  const route = useRouter();
  const Ctx = useAuthContext();

  const generateQRCode = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/generate2FA`, {
        credentials: 'include',
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setQrUrl(url);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  useEffect(() => {
    if (code.length === 6) {
      handleSubmitVerificationCode();
    }
  }, [code]);

  const handleGenerateQRCode = () => {
    generateQRCode(); 
  };

  const handleVerificationCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(event.target.value);
  };

  const handleSubmitVerificationCode = async () => {
    try {
      const response = await M_fetch.post('/auth/verify2FA',
      {},
      {code
      });
      console.log('alooooooooooooooooooooooooooo ',response);
      if (response.ok) {
        //('Verification successful');
        // await Ctx.loadUserData();
        Ctx.setIsAuthenticated(true);
        route.push('/Landing');
        // window.location.reload();
        //('After route.push');
      } else {
        console.error('Verification failed');
      }
    } catch (error) {
      console.error('Error verifying code:', error);
    }
  };

  return (
    // <Layout>
    <Card className="flex items-center justify-center w-1/2 h-1/2">

      <div className="text-backdlight items-center justify-center ">
        <Button onClick={handleGenerateQRCode} className="button relative  bg-lavender py-2 px-24 border rounded-2xl hover:bg-blue text-backdark font-bold ">Generate QR Code</Button>
        <span className="">

        {qrUrl && <img src={qrUrl} alt="QR Code" className="" />}
        </span>
        <Input
          type="text"
          placeholder="Enter verification code"
          value={code}
          onChange={handleVerificationCodeChange}
          className="w-1/2 "
          />
        <Button onClick={handleSubmitVerificationCode} className="bg-lavender py-2 px-24 border rounded-2xl hover:bg-blue text-backdark font-bold ">Submit Verification Code</Button>
      </div>
    </Card>
    // </Layout>
  );
};

export default TwoFactorAuth;