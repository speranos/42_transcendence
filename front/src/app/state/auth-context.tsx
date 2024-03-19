  'use client'
  import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
  } from "react";
  import io,{ Socket } from "socket.io-client"; // Import socket.io-client library
  // import router from 'next/router';
  import { useRouter } from 'next/navigation'; 
  // import basicFetch from "@utils/basicFetch";
  import isBrowser from "@/app/utils/isBrowser";
  import {
    removeLocalStorage,
    removeUser,
    setLocalStorage,
  } from "@/app/utils/LocalStorage";
  // import { cookies } from 'next/headers';
  import { hasCookie } from 'cookies-next';
import CookiesInspect from "./Cookies";

  // import { ICurrentUser } from "global/types";

  export interface IUser {
    userID: string;
    userName: string;
    nickname: string;
    first_name: string;
    last_name: string;
    twitterUsername?: string;
    intraUsername: string;
    email: string;
    bio: string;
    link: string;
    cover_url: string;
    is_following: boolean;
    is_follower: boolean;
    followers_count: number;
    following_count: number;
    is2FA: boolean;
  }
  export interface ICurrentUser extends IUser {}


  export interface AuthState {
    user: IUser | null;
    isAuthenticated: boolean;
    loadingUser: boolean;
    setIsAuthenticated: (state:boolean)=>void
    loadUserData: () => Promise<IUser | null>;
    updateUserData: () => Promise<void>;
    initializeSocket: (yo:string) => Promise<void>;
    logout: () => void;
    socket: Socket | null;
  }
  
  export const AuthContext = createContext<AuthState | undefined>(undefined);
  
  const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<IUser | null>(null);
    const [loadingUser, setLoadingUser] = useState<boolean>(true);
    const ref = useRef(false);
    const router = useRouter();
    // const socketRef = useRef<Socket | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
  
    const initializeSocket = async (yo:string) => {
      try {
        const newSocket = await new Promise<Socket>((resolve, reject) => {
          const socket = io("http://localhost:3056", {
            withCredentials: true,
            transports: ["websocket"],
            query: { userID: yo },
          });
    
          socket.on("connect", () => {
            //("Socket connected");
            resolve(socket);
          });
    
          socket.on("disconnect", () => {
            //("Socket disconnected");
          });
    
          socket.on("error", (error: any) => {
            console.error("WebSocket error:", error);
            reject(error);
          });
        });
    
        setSocket(newSocket);
        // socketRef.current = newSocket;
      } catch (error) {
        console.error("Error initializing socket:", error);
      }
    };

    // useEffect(() => {
    //   const initializeSocket = () => {
    //     const newSocket = io("http://localhost:3056", {
    //       withCredentials: true,
    //       transports: ["websocket"]
    //     });
  
    //     newSocket.on("connect", () => {
    //       //("Socket connected");
    //     });
  
    //     newSocket.on("disconnect", () => {
    //       //("Socket disconnected");
    //     });
  
    //     newSocket.on("error", (error: any) => {
    //       console.error("WebSocket error:", error);
    //     });
  
    //     setSocket(newSocket);
    //     socketRef.current = newSocket;
    //   };
  
    //   if (isAuthenticated && !socket) {
    //     initializeSocket();
    //   }
    // if(CookiesInspect)
    //   //("true");
    const hasAccessToken = () => {
      const cookies = document.cookie.split(';').map(cookie => cookie.trim());
      // //("all", cookies);
      for (const cookie of cookies) {
          const [name, value] = cookie.split('=');
          if (name === 'userLoggedIn' && value === 'true') {
            // //(name);
              return true; // Atoken cookie is set
          }
      }
      return false; // Atoken cookie is not set
  };

    useEffect(() => {
      if (!isBrowser) return;
      const  tok = hasAccessToken() as Boolean;
      // //(tok);
      if (!user && !ref.current && tok) {
        //("token =>", tok);
        setLoadingUser(true);
        ref.current = true;
        loadUserData()
          .then((data) => {
            if (data) {
              //("User data stored in local storage:", data);
              if (data === null) throw new Error("User data is null. Redirecting to /Login");
              setUser(data);
              setIsAuthenticated(true);
            }
          })
          .catch((error) => {
            console.error(error);
            setIsAuthenticated(false);
            router.push("/Login");
          })
          .finally(() => {
            setLoadingUser(false);
          });
      }
      // if (isAuthenticated && !socket) {
      //   initializeSocket();
      // }
      
    }, []);

    // useEffect(() => {
    //   if (isAuthenticated && !socket) {
    //     if(user) initializeSocket(user.userID);
    //   }
    
    //   return () => {
    //     // if (socketRef.current) {
    //     //   socketRef.current.disconnect();
    //     // }
    //   };
    // }, [isAuthenticated, socket]);
  
    const loadUserData = async () => {
      try {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
          credentials: "include"
        });
        if (resp.status === 200) {
          return await resp.json();
        }
      } catch (error) {
        console.error(error);
      }
      return null;
    };
  
    const updateUserData = async () => {
      const data = await loadUserData();
      setUser(data);
    };
  
    const logout = async () => {
      try {
          const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/disconnect`, {
            method: "GET",
            credentials: "include"
          });
          console.log(resp.ok);
          if (resp.ok) {
          setUser(null);
          setIsAuthenticated(false);
          router.push("/Login");
        } else {
          console.error("Logout failed with status:", resp.status);
        }
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };
  
    return (
      <AuthContext.Provider
        value={{
          isAuthenticated,
          user,
          initializeSocket,
          setIsAuthenticated,
          loadingUser,
          loadUserData,
          updateUserData,
          logout,
          socket: socket,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };
  
  const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error("useAuthContext must be used within a AuthContextProvider");
    }
    return context;
  };
  
  export { AuthContextProvider, useAuthContext };