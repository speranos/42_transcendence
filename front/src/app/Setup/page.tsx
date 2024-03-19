'use client'
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation'
import { useAuthContext } from '../state/auth-context';
import M_fetch from "@/app/utils/M_fetch";
import { log } from 'console';
import Layout from '../main_layout';

interface RegistrationProps {
  title: string,
}

const Registration: React.FC<RegistrationProps> = () => {
  const ctx = useAuthContext();
  const router = useRouter(); // Use the useRouter hook
  // //('2fa :', ctx.user?.is2FA);
  const [AF, set2AF] = useState(ctx.user?.is2FA);
  const [Toggled, setToggled] = useState(0);
  const [username, setusername] = useState(ctx.user?.userName);
  const [Prof, setProf] = useState<File>();
  const [Avat, setAvat] = useState(ctx.user?.link);

  const toggleSwitch = () => {
    set2AF(prevState => !prevState);
    setToggled(prevState => prevState + 1);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setusername(event.target.value);
  };

  const handleAvatarchange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // //('file',file)
    // const url = URL.createObjectURL(file);
    // //('urlfile', url)
    if (file) {
      setProf(file);
      setAvat(URL.createObjectURL(file));
    }
  };

  const goLanding = async () => {
    router.push('/Landing');
  }

  const handleClick = async () => {
    try {
      const formData = new FormData();
      if (Prof) {
        formData.append('avatar', Prof);
        const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/settings/changeAvatar`, {
          method: "POST",
          credentials: "include",  
          body: formData,
        })
      }
      if (username !== ctx.user?.userName) {
        //('change username');
        await M_fetch.post(`/user/settings/changeUsername`, {}, {username});
      }
      if(Toggled % 2 !== 0){
        if (AF === true) {
          await M_fetch.post(`/user/settings/Enable2FA`);
        } else {
          await M_fetch.post(`/user/settings/Disable2Fa`);
        }
      }
    } catch (error) {
      console.error('Error handling profile changes:', error);
    } finally {
      router.push('/Landing');
    }
  };

  const gologin = () => {
    router.replace('/');
  }

  if(!ctx.isAuthenticated){
     return <Layout><div className='flex items-center justify-center text-gradient p-20 underline'>unknown user, Please Log In Again
    <div className='w-10'></div><Button className='flex items-center justify-center text-gradient  underline border border-solid border-blue px-20' onClick={gologin}>To Login Page</Button>
    </div></Layout>;
  }

  return (
    <Layout>

      
      <div className="bg-backdark flex items-center justify-center h-screen w-full text-backlight">
        <section className="max-w-7xl">

    <Dialog >
      <DialogTrigger asChild>
        <Button variant={'outline'}>setup your profile informations</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] z-50 text-backlight backdrop-blur-xl font-bold">
        <DialogHeader>
          <DialogTitle className="text-gradient">Edit profile</DialogTitle>
          <DialogDescription className="text-sm font-thin">
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-6">
          <div className="grid grid-cols-4 items-center gap-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={Avat} alt="avatar" />
            </Avatar>
            <input
              id="pic"
              type="file"
              value={''}
              onChange={handleAvatarchange}
              className="w-full border-spacing-1 text-backdark"
              />
            {/* <Input id="picture" type="file" className="w-fit border-spacing-1" /> */}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-left text-gradient">
              Username
            </Label>

            {/* <Input id="name" type='name' onInput={(input) => { //(input) }} className="w-fit border-spacing-1 text-backdark" /> */}
            <input
              id="name"
              type="text"
              value={username || ''}
              onChange={handleNameChange}
              className="w-fit border-spacing-1 text-backdark"
              />
          </div>
          <div className="grid grid-cols-4 items-center gap-4 w-full">
            <div className="contents items-center space-x-2 justify-center">
              <Label htmlFor="2FA" className="text-left text-gradient">
                2 FA
              </Label>
              <div className="inline-flex">
                <label className="switch mx-2">
                  <input type="checkbox" checked={AF} onChange={toggleSwitch} />
                  <span className="slider round"></span>
                </label>
                <span>{AF ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" type="submit" onClick={handleClick}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <div className="pt-10 flex items-center justify-center">
            <Button variant="outline" type="submit" onClick={goLanding}>
            Cancel
          </Button>
    </div>
              </section>
    </div>
    </Layout>
  );
};

export default Registration;
