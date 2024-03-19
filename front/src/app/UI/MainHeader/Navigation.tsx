import { Fragment, useEffect } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Registration from '../../Registration/page';
import { useState } from 'react';
import { useAuthContext, } from '@/app/state/auth-context';
import { Dropdown } from '@/app/UI/Dropnotif/DropMenu';
import { GamePopup } from '../GamePopup/GamepPopup';
import Colorful from '@/app/Wtf/page';

interface NavigationItem {
  name: string;
  href: string;
  current: boolean;
}

interface game{
  name : string;
  userId : string;
}


const navigation: NavigationItem[] = [
  { name: 'Play', href: '/Landing', current: true },
  { name: 'Leaderboard' , href: '/Dashboard', current: false },
  { name: 'Chat', href: '/Chat', current: false },
];

function classNames(...classes: (string | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}

const Navigation: React.FC = () => {
  const ctx = useAuthContext();
  // //('navugation ds', ctx.isAuthenticated);
  const [activePage, setActivePage] = useState('Landing');

  const handleMouseEnter = (name: string) => {
    setActivePage(name);
  };

  const handleMouseClick = async () => {
    await ctx.updateUserData();
  };

  useEffect (() => {

    if(ctx.socket)
      ctx.socket.on("recv req",(game)=>
      <GamePopup game={game}></GamePopup>
    )
  }, []);


  return (

    ctx.isAuthenticated ? (
      <Disclosure as="nav" className="bg-gradient-to-l from-backdark to-blue">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-14 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button
                    className="relative inline-flex items-center justify-center rounded-md p-2 text-backlight hover:bg-backdark hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  >
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                {/* <Disclosure as="nav" className="bg-gradient-to-l from-backdark to-blue h-14"> */}
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex w-full h-full justify-start items-center">
                    <div className="hidden  h-8 w-8 sm:ml-6 sm:block">
                      <img src='/logo.jpeg' alt="logo" />
                    </div>
                    <div className="hidden sm:ml-6 sm:block">
                      <div className="flex space-x-4">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              'text-lg',
                              item.name === activePage ? 'text-backlight' : 'text-lavender',
                            )}
                            onMouseEnter={() => handleMouseEnter(item.name)}
                          >
                            <span className="hover:text-xl">{item.name}</span>
                          </Link>
                        ))}
                      </div>
                      {/* <Link href="/Registration" className="text-lg text-backlight">
                          <span className="hover:text-xl">Create account to continue</span>
                        </Link> */}
                    </div>

                  </div>
                </div>
                {/* </Disclosure> */}
                {/* <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <img src="" alt="logo" />
                  </div>
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current ? 'text-backlight' : 'text-backlight hover:text-backdark',
                            'rounded-md px-3 py-2 text-sm font-medium'
                          )}
                          aria-current={item.current ? 'page' : undefined}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div> */}
                <div className="absolute inset-y-0 right-44 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-20 w-8 h-8 ">

                  <Dropdown></Dropdown>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="relative flex rounded-full bg-pink text-sm focus:outline-none focus:ring-2 focus:ring-backlight focus:ring-offset-2">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <a onClick={handleMouseClick}>

                          <img src={`${ctx.user?.link}`}
                            className="h-8 w-8 rounded-full"
                            />
                        </a>
                        {/* )} */}
                        {/* <img
                          src={ctx.user.link}
                          alt=""
                        /> */}
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute  text-backlight border border-t-0 border-solid border-blue right-5 top-12 z-10 w-44 origin-top-right shadow backdrop-blur-md py-1 mb-4">
                        <Menu.Item>
                          {({ active }) => (
                            <Link href={`/Profile/${ctx.user?.userID}`}
                              className={classNames(active ? 'underline' : '', 'block px-4 py-2 text-sm text-backlight')}
                            >
                              Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link href="/Settings"
                              className={classNames(active ? 'underline' : '', 'block px-4 py-2 text-sm text-backlight')}
                            >
                              Settings
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a href="/Login"
                              className={classNames(active ? 'underline' : '', 'block px-4 py-2 text-sm text-backlight mb-4')}
                              onClick={ctx.logout}
                            >
                    
                              Sign out
                              {/* </a> */}
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'block rounded-md px-3 py-2 text-base font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    ) : (

      <Disclosure as="nav" className="bg-gradient-to-l from-backdark to-blue h-14">
        {/* <Disclosure.Panel> */}
        {/* <div className="grid grid-cols-2"> */}

        <div className="flex h-full mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
           <div className="flex w-1/2 items-center justify-start">
            <div className="">
              {/* <img src="" alt="logo" /> */}
            </div>
          </div>
          {/* <div className="flex items-center  justify-end w-full text-backlight hover:text-pink">

                  <Registration title='Sign up Register' />
                </div> */}
        </div>

        {/* </div> */}
        {/* </Disclosure.Panel> */}
      </Disclosure>
    )
  );
};

export default Navigation;

