'use client'
import ReactDOM from 'react-dom';
//import 'bootstrap/dist/css/bootstrap.css';
import React, { useEffect, useState } from "react";


// import "./App.css";
import { Socket, io } from "socket.io-client";
import { usePathname, useRouter } from 'next/navigation';
import Layout from '../main_layout';
import ReactConfetti from 'react-confetti'
import { split } from 'postcss/lib/list';

const Colorful = () => {
    interface Paddle {
      x: number;
      y: number;
      w: number;
      h: number;
      color: string;
      score: string;
      result : string;
    }
    interface Ball {
      x: number;
      y: number;
      radius: number;
      speed: number;
      velocityX: number;
      velocityY: number;
      color: string;
    }
    const [left_p, setLeft_p] = useState<Paddle>();
    const [right_p, setRight_p] = useState<Paddle>();
    const [ball, setBall] = useState<Ball>();
    const [init, setInit] = useState<Boolean>(false);
    const [image, setImage] = useState<Boolean>(false);
    const [mysocket, setSocket] = useState<Socket | null>(null);
    const [showDraw, setShowdraw] = useState(true);
    const [showwin, setShowwin] = useState(false);
    const [showlose, setShowlose] = useState(false);
    const [ingame, setIngame] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [avatar1Url, setAvatar1] = useState<string>();
    const [avatar2Url, setAvatar2] = useState<string>();
    const [showimage, setShowimage] = useState(false);
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  
    const [canvasDms, setCanvasDms] = useState({
      width: 800,
      height: 400,
    });
    let roomname : string;
    useEffect(() => {
      const canvasElement = document.getElementById("pong") as HTMLCanvasElement;
      setCanvas(canvasElement);
    }, []);
  
    useEffect(() => {
      if (canvas) {
        const ctx = canvas.getContext("2d");
        setContext(ctx);
      }
    }, [canvas]);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const resp = await fetch('http://localhost:3000/classic', {
            credentials: "include",
          });
          if (resp.ok) {
            const playerData = await resp.text();
            console.log("Player data:", playerData);
            
            const newSocket = io("http://localhost:3000/colorful");
            setSocket(newSocket);
            return () => {
              if (newSocket) {
                newSocket.disconnect();
              }
            };
            
          } else {
            console.error("Error fetching data:", resp.statusText);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }, []); 

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', (event) => {
        mysocket?.disconnect();
      });
    }
    useEffect(() => {
      mysocket?.emit("set my socket");
    },[mysocket]);
    
    mysocket?.on("already in game", (msgg)=>{
       clearCanvas();
       setShowdraw(false);
       setIngame(true);
      })
      
      mysocket?.on("am waiting", () => {
        setWaiting(true);
    })

    mysocket?.on("matchFound", (room, avatar1, avatar2) => {
      setAvatar1(avatar1);
      setAvatar2(avatar2);
      setWaiting(false);
      setShowimage(true);
      setShowdraw(true);
      roomname = room;
      mysocket.emit("hello player", [roomname, canvas?.width, canvas?.height, 0]);
    });
  
    mysocket?.on("message", (msg) =>
    {
        setLeft_p(msg);
    });
    mysocket?.on("message1", (msg) =>
    {
        setRight_p(msg);
    });
    mysocket?.on("message2", (msg3) => {
        setBall(msg3);
    });
    mysocket?.on("finish",() =>{
        clearCanvas();
        setShowdraw(false);
        setShowwin(true);
        setIngame(false);
        setShowimage(false);
    });
    mysocket?.on("you win", (msgg)=>{
          clearCanvas();
          setShowdraw(false);
      setShowwin(true);
      setIngame(false);
      setShowimage(false);
    })
    mysocket?.on("you lose", (msgg)=>{
          clearCanvas();
          setShowdraw(false);
      setShowlose(true);
      setIngame(false);
      setShowimage(false);
    })
    useEffect(() => {
      const canvas = document.getElementById("pong") as HTMLCanvasElement;
      const context = canvas?.getContext("2d");
          const handleMouseMove = (event: MouseEvent) => {
          const rect = canvas?.getBoundingClientRect();
          const mouseYY = event.clientY - rect?.top - (280 / 5) /2;
          const mouseY = (mouseYY / 280) * 100;
          mysocket?.emit("moveLeftPaddle", [mouseY , roomname, canvas?.height]);
      };
      if (canvas) {
        canvas.addEventListener("mousemove", handleMouseMove);
      }
      return () => {
        if (canvas) {
          canvas.removeEventListener("mousemove", handleMouseMove);
        }
      };
    }, [mysocket]);
  
  
    const clearCanvas = () => {
      const canvas = document.getElementById("pong") as HTMLCanvasElement;
      const context = canvas?.getContext("2d");
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    useEffect(() => {
      const canvas = document.getElementById("pong") as HTMLCanvasElement;
      const context = canvas?.getContext("2d");
        function drawNet() {
          for (let i = 0; i < canvasDms.height; i += 15) {
            drawRect(canvasDms.width / 2 - 1, 0 + i, 2, 10, "white");
          }
        }
        function drawRect(x: number,y: number,w: number,h: number,color: string) 
        {
            if (context) 
            {
              context.fillStyle = color;
              context.fillRect(x, y, w, h);
            }
          }
          
          function drawCircle(x: number, y: number, r: number, color: string) {
            if (context) {
              context.fillStyle = color;
              context.beginPath();
              context.arc(x, y, r, 0, Math.PI * 2, false);
              context.closePath();
              context.fill();
            }
          }
          
          function drawText(text: string, x: number, y: number, color: string, font: string) {
            if (context) {
              context.fillStyle = color;
              context.font = font;
              context.fillText(text, x, y);
            }
          }
          if (left_p && right_p && ball) {
          clearCanvas();
          let canvascolor = "bisque";
          let ballcolor = "deeppink";
          let leftpcolor = "bisque";
          let rightpcolor = "bisque";
          drawRect(0, 0, canvasDms.width, canvasDms.height, canvascolor);
          drawRect(left_p.x, ((left_p.y * canvasDms.height) / 400), canvasDms.width / 40, canvasDms.height/5, leftpcolor);
          drawRect(canvasDms.width - (canvasDms.width / 40), ((right_p.y * canvasDms.height) / 400), canvasDms.width / 40, canvasDms.height/5, rightpcolor);
          drawCircle(ball.x * canvasDms.width / 800, ball.y * canvasDms.height / 400, canvasDms.width/100, ballcolor);
          drawNet();
          let size = canvasDms.height * 20 / 400;
          let font = size + "px serif";
          drawText(left_p.result, canvasDms.width / 5, canvasDms.height / 6, "black", font);
          drawText(right_p.result,(3.5 * canvasDms.width) / 5,canvasDms.height / 6,"black", font);
          }
  
      }, [mysocket, ball]);
      if (showwin) {
        mysocket?.disconnect();
      }
      if (showlose) {
        mysocket?.disconnect();
      }
      if (ingame)
      {
        mysocket?.disconnect();
      }
  
      return (
        <div style={{ position: 'relative' }}>
        <div className=" bg-backdark  w-screen h-screen">

          <section className="flex items-center justify-center h-screen">
          {showimage && <img src={avatar1Url} alt="Avatar 1" className="absolute left-10 top-20 h-30 w-16 rounded-full" />}
          {showimage && <img src={avatar2Url} alt="Avatar 2" className="absolute right-10 top-20 h-30 w-16 rounded-full" />}
            <div style={{ marginTop: '70px' }}>
              <div className="flex items-center justify-center h-full">
                <canvas id="pong" width="800px" height="400px"></canvas>
              </div>
              {showwin && <h1 className="flex justify-center text-3xl text-backlight items-center">You Won!</h1>}
              {showwin && <ReactConfetti
                 className="w-screen">
                </ReactConfetti>}
              
              {showlose && <h1 className="flex justify-center text-3xl text-backlight items-center">Loser</h1>}
              {waiting && <h1 className="flex justify-center text-3xl text-backlight items-center">Wait..</h1>}
              {ingame && <h1 className="flex justify-center text-3xl text-backlight items-center">What are you trying to do?</h1>}
            </div>
          </section>
        </div>
        </div>
    );
  }

  export default Colorful