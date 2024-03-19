export interface left_p {
    x : number;
    y : number;
    w : number;
    h : number;
    color : string;
    score : string;
    result : string;
  }
  export interface right_p {
    x : number;
    y : number;
    w : number;
    h : number;
    color : string;
    score : string;
    result : string;
  }


  export interface paddle {
    x : number;
    y : number;
    w : number;
    h : number;
    color : string;
    score : string;
    result : string;
  }
  export interface ball {
    x : number;
    y : number;
    radius : number;
    speed : number;
    velocityX : number;
    velocityY : number;
    color : string;
  }
  export interface canvas {
    h : number;
    w : number;
  }
  export class Player {
    playerid: string;
    socket: any;
    socketid : string;
    playername: string;
    playeravatar: string;
    ingame: boolean;
    iswait : boolean;
    matchplayed : number;
    nofloss : number;
    nofwins : number;
  }
  export class Game {
    paddle : paddle;
    student1: Player;
    student2: Player;
    newpaddle : number;
    right_p: right_p;
    left_p : left_p;
    ball: ball;
    ball1: ball;
    canvas : canvas;
    player1 : string;
    player2: string;
    p: 0;
    socket1 : any;
    socket2 : any;
    two: boolean;
    deja: 0;

    constructor() {

      this.paddle = {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        color: '',
        score: '0',
        result: '0',
      };
      this.student1 = {
        playerid:'',
        socket:'',
        socketid :'',
        playername:'',
        playeravatar:'',
        ingame: false,
        iswait: false,
        matchplayed : 0,
        nofloss : 0,
        nofwins : 0,
      }

      this.student2 = {
        playerid:'',
        socket:'',
        socketid :'',
        playername:'',
        playeravatar:'',
        ingame: false,
        iswait: false,
        matchplayed : 0,
        nofloss : 0,
        nofwins : 0,
      }

      this.left_p = {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        color: '',
        score: '0',
        result: '0',
      };
      this.right_p = {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        color: '',
        score: '0',
        result: '0',
      };
      this.canvas = {
        h :0,
        w :0,
      }
      this.ball = {
        x: 0,
        y: 0,
        radius: 0,
        speed: 0,
        velocityX: 5,
        velocityY: 5,
        color: '',
      };
      this.ball1 = {
        x: 0,
        y: 0,
        radius: 0,
        speed: 0,
        velocityX: 5,
        velocityY: 5,
        color: '',
      };
    }
  }
  
  function generateRandomString(length: number): string 
  {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
    return randomString;
  }
  let j = 0;
  let ids = [];
  for (let i = 0; i < 1000; i++)
  {
    ids[i] = generateRandomString(4);
  }
  export {ids};