// import { Controller, Get, Logger, Req, Res, UseGuards } from '@nestjs/common';
// import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway} from '@nestjs/websockets';
// import { Server } from 'socket.io';
// import { Player, ids} from './component';
// import {ball, } from './component';
// import { subscribe } from 'diagnostics_channel';
// import { io, Socket} from 'socket.io-client'; 
// import { Game } from './component';
// import { AuthGuard } from '@nestjs/passport';
// import { GameService } from './game.service';
// import { Prisma } from '@prisma/client';
// import { PrismaService } from 'src/prisma/prisma.service';
// @WebSocketGateway({
//     cors: {
//         origin: '*',
//         credentials: true,
//     },
//     namespace: '/classicvip',
// })
// 	export class ClassicVip implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
// 		private logger: Logger = new Logger('AppGateway');
// 		constructor(private readonly gameService: GameService) {};
// 		private interval: NodeJS.Timeout | null = null;
// 		private out: Map<string, any> = new Map();
// 		private games: Map<string, Game> = new Map<string, Game>();
// 		private roomname1 : Map<string, string> = new Map<string, string>();
// 		private players : Map<string, Socket[]> = new Map();
// 		private creategame : Map<string, boolean> = new Map<string, boolean>();
// 		private gamerun : Map<string, number> = new Map<string, number>();
// 		private interv : Map<string,NodeJS.Timeout| null > = new Map<string, NodeJS.Timeout| null>();
// 		private socketMap: Map<string, any[]> = new Map<string, any[]>();
// 		// private game: Map<string, any> = new Map<string, any>();
// 		private playerdata1: Player[];
// 		private playerdata2: Player[];
// 		private playerdata : Map<string, Player[]> = new Map<string, Player[]>();
// 		private prisma = new PrismaService();
// 		server : Server;
// 		player1socket: Socket;
// 		player2socket: Socket;
// 		afterInit(server: Server) {
// 			this.server = server;
// 			this.logger.log('Initialized');
// 		}
// 		init = false;
// 		j = 0;
// 		p1 = 0;
// 		p2 = 1;
// 		enter = true;
// 		enter1 = true;
// 		leftblack = 0;
// 		rightblack = 0;
// 		leftchance = 0;
// 		rightchance = 0;
// 		first = 0;
// 		game: any;
// 		daroom : any;
// 		forbiden = false;
// 		deja = 0;
// 		cumfromWin = false;
// 		goodbye = false;
// 		socketIds = [];
// 		async handleDisconnect(client: Socket) {
// 		try{
// 		this.logger.log(` Client Disconnected: ${client.id}`);
// 		let interval = this.interv.get(this.roomname1.get(`${client.id}`));
// 		if (interval) {
// 			clearInterval(interval);
// 			interval = null;
// 		}
// 		this.server.to(this.roomname1.get(`${client.id}`)).emit('finish');
// 		this.gamerun.set(this.roomname1.get(`${client.id}`), 0);
// 		if (this.forbiden)
// 		{
// 			//("get out");
// 			this.forbiden = false;
// 		}
// 		else if (this.out.get(this.roomname1.get(`${client.id}`)))
// 		{
// 			if (client.id == this.games.get(this.roomname1.get(`${client.id}`)).student1.socketid && this.first == 0 && this.cumfromWin == false)
// 			{
// 				this.first++;
// 				await this.prisma.games.update({
// 					where: {
// 						gameID: this.roomname1.get(`${client.id}`),
// 					},
// 					data: {
// 						player1ID: this.games.get(this.roomname1.get(`${client.id}`)).student1.playerid,
// 						player2ID: this.games.get(this.roomname1.get(`${client.id}`)).student2.playerid,
// 						winnerID: this.games.get(this.roomname1.get(`${client.id}`)).student2.playerid,
// 						scoreP1: Number(this.games.get(this.roomname1.get(`${client.id}`)).left_p.score),
// 						scoreP2: Number(this.games.get(this.roomname1.get(`${client.id}`)).right_p.score),
// 						specialMode: false,
// 					}
// 				});
// 				await this.prisma.user.update({
// 					where: {
// 						userID: this.games.get(this.roomname1.get(`${client.id}`)).student1.playerid,
// 					},
// 					data: {
// 						userInGame : false,
// 						matchPlayed : this.games.get(this.roomname1.get(`${client.id}`)).student1.matchplayed + 1,
// 						nOfLoss: this.games.get(this.roomname1.get(`${client.id}`)).student1.nofloss + 1,
// 						winRate : ((this.games.get(this.roomname1.get(`${client.id}`)).student1.nofwins) * 100) / (this.games.get(this.roomname1.get(`${client.id}`)).student1.matchplayed + 1),
// 					}
// 				});
// 				await this.prisma.user.update({
// 					where: {
// 						userID: this.games.get(this.roomname1.get(`${client.id}`)).student2.playerid,
// 					},
// 					data: {
// 						userInGame : false,
// 						matchPlayed : this.games.get(this.roomname1.get(`${client.id}`)).student2.matchplayed + 1,
// 						nOfWins: this.games.get(this.roomname1.get(`${client.id}`)).student2.nofwins + 1,
// 						winRate : ((this.games.get(this.roomname1.get(`${client.id}`)).student2.nofwins + 1) * 100) / (this.games.get(this.roomname1.get(`${client.id}`)).student2.matchplayed + 1),
// 					}
// 				});
// 			}
// 			else if(client.id == this.games.get(this.roomname1.get(`${client.id}`)).student2.socketid && this.first == 0 && this.cumfromWin == false)
// 			{
// 				this.first++;
// 				await this.prisma.games.update({
// 					where: {
// 						gameID: this.roomname1.get(`${client.id}`),
// 					},
// 					data: {
// 						player1ID: this.games.get(this.roomname1.get(`${client.id}`)).student1.playerid,
// 						player2ID: this.games.get(this.roomname1.get(`${client.id}`)).student2.playerid,
// 						winnerID: this.games.get(this.roomname1.get(`${client.id}`)).student1.playerid,
// 						scoreP1: Number(this.games.get(this.roomname1.get(`${client.id}`)).left_p.score),
// 						scoreP2: Number(this.games.get(this.roomname1.get(`${client.id}`)).right_p.score),
// 						specialMode: false,
// 					}
// 				});
// 				await this.prisma.user.update({
// 					where: {
// 						userID: this.games.get(this.roomname1.get(`${client.id}`)).student1.playerid,
// 					},
// 					data: {
// 						userInGame : false,
// 						matchPlayed : this.games.get(this.roomname1.get(`${client.id}`)).student1.matchplayed + 1,
// 						nOfWins: this.games.get(this.roomname1.get(`${client.id}`)).student1.nofwins + 1,
// 						winRate : ((this.games.get(this.roomname1.get(`${client.id}`)).student1.nofwins + 1) * 100) / (this.games.get(this.roomname1.get(`${client.id}`)).student1.matchplayed + 1),
// 					}
// 				});
// 				await this.prisma.user.update({
// 					where: {
// 						userID: this.games.get(this.roomname1.get(`${client.id}`)).student2.playerid,
// 					},
// 					data: {
// 						userInGame : false,
// 						matchPlayed : this.games.get(this.roomname1.get(`${client.id}`)).student2.matchplayed + 1,
// 						nOfLoss: this.games.get(this.roomname1.get(`${client.id}`)).student2.nofloss + 1,
// 						winRate : ((this.games.get(this.roomname1.get(`${client.id}`)).student2.nofwins) * 100) / (this.games.get(this.roomname1.get(`${client.id}`)).student2.matchplayed + 1),
// 					}
// 				});
// 			}
// 		}
// 	}
// 	catch(e){}
// 	}
// 	@SubscribeMessage('set my socket')
// 	async handleCreateRoom(client:any, arg : any)
// 	{
// 		try{
// 			console.log('id: ',arg)
// 		this.out.set(arg, this.goodbye);
// 		let roomName: string;
// 		roomName = arg;
// 		this.playerdata1 = await this.gameService.getPlayer();
// 		if (this.playerdata1[this.j].ingame == true)
// 		{
// 			while (this.playerdata1.length > 0)
// 			{
// 				this.playerdata1.pop();
// 			}
// 			this.forbiden = true;
// 			client.emit("already in game");
// 		}
// 		this.playerdata2 = this.playerdata.get(arg) || [];
// 		this.playerdata.set(arg, this.playerdata2);
// 		this.playerdata.get(arg).push(this.playerdata1[this.j]);
// 		//(this.playerdata.get(arg).length);
// 		this.socketIds = this.players.get(arg) || [];
// 		this.players.set(arg, this.socketIds);
// 		this.players.get(arg).push(client.id);
// 		const socketArray = this.socketMap.get(arg) || [];
// 		socketArray.push(client);
// 		this.socketMap.set(arg, socketArray); 
// 		client.emit("am waiting");
// 		this.creategame.set(arg, this.enter);
// 		this.roomname1.set(client.id, arg);
// 		this.j++;
// 		// console.log("----------->",this.players.get(arg).length);
// 		if (this.players.get(arg).length == 2)
// 		{
// 			this.out.set(arg,true);
// 			this.game = new Game();
// 			this.games.set(arg, this.game);
// 			this.games.get(arg).two = true;
// 			this.games.get(arg).player1 = this.socketMap.get(arg)[0].id;
// 			this.games.get(arg).socket1 = this.socketMap.get(arg)[0];
// 			this.games.get(arg).player2 = this.socketMap.get(arg)[1].id;
// 			this.games.get(arg).socket2 = this.socketMap.get(arg)[1];
// 			this.roomname1.set(this.games.get(arg).player2, arg);
// 			this.gamerun.set(arg, 1);
// 			let sockett = [];
// 			sockett = this.players.get(arg);
// 			let playerdata12: Player[] = this.playerdata.get(arg);
// 			if (playerdata12 && sockett)
// 			{
// 				if (sockett.length > 0 && playerdata12.length > 0)
// 				{
// 					playerdata12[0].socketid = sockett[0];
// 					playerdata12[1].socketid = sockett[1];
// 				}
// 				this.games.get(arg).student1 = playerdata12[0];
// 				this.games.get(arg).student2 = playerdata12[1];
// 			}
// 			this.forbiden = false;
// 			this.games.get(arg).two = true;
// 			if (playerdata12)
// 			{
// 				await this.prisma.user.update({
// 					where: {
// 						userID: playerdata12[0].playerid,
// 					},
// 					data: {
// 						userWaiting : false,
// 						userInGame : true,
// 					}
// 				});
// 				await this.prisma.user.update({
// 					where: {
// 						userID: playerdata12[1].playerid,
// 					},
// 					data: {
// 						userWaiting : false,
// 						userInGame : true,
// 					}
// 				});
// 			}
// 			let socketttt = this.socketMap.get(arg);
// 			if (socketttt.length > 0)
// 			{
// 				socketttt[0].join(roomName);
// 				socketttt[1].join(roomName);
// 			}
// 			this.first = 0;
// 			this.cumfromWin = false;
// 			// console.log("game id:",arg);
// 			await this.prisma.games.update({
// 				where: {
// 					gameID: arg,
// 				},
// 				data: {
// 					player1ID: this.games.get(arg).student1.playerid,
// 					player2ID: this.games.get(arg).student2.playerid,
// 					specialMode: false,
// 				}
// 			});
// 			// console.log("m herehggggggggghhhhhhhhhh");
// 			if (this.creategame.get(arg))
// 			{
// 				console.log("matchfound");
// 				this.server.to(arg).emit('matchFound', arg, this.games.get(arg).student1.playeravatar,this.games.get(arg).student2.playeravatar);
// 				this.creategame.set(arg, false);
// 			}
// 		}
// 	}
// 	catch(e){}
// 	}

// 	@SubscribeMessage('moveLeftPaddle')
// 	handleleftpaddle(client: Socket, arg: any) {
// 	try{
// 	if (this.gamerun.get(arg[1]))
// 	{
// 		if (client.id == this.games.get(arg[1]).player1) 
// 		{
// 			this.games.get(arg[1]).left_p.y = (arg[0] * 400) / 100;
// 			if (this.games.get(arg[1]).left_p.y > arg[2] - this.games.get(arg[1]).left_p.h)
// 				this.games.get(arg[1]).left_p.y = arg[2] - this.games.get(arg[1]).left_p.h;
// 			if (this.games.get(arg[1]).left_p.y < 0)
// 				this.games.get(arg[1]).left_p.y = 0;
// 			this.server.to(arg[1]).emit('message', this.games.get(arg[1]).left_p);
// 		}
// 		else if (client.id == this.games.get(arg[1]).player2)
// 		{
// 			this.games.get(arg[1]).right_p.y = (arg[0] * 400) / 100;
// 			if (this.games.get(arg[1]).right_p.y > arg[2] - this.games.get(arg[1]).right_p.h)
// 				this.games.get(arg[1]).right_p.y = arg[2] - this.games.get(arg[1]).right_p.h;
// 			if (this.games.get(arg[1]).right_p.y < 0)
// 				this.games.get(arg[1]).right_p.y = 0;
// 			this.server.to(arg[1]).emit('message1', this.games.get(arg[1]).right_p);
// 		}
// 	}
// 	}
// 	catch(e){}
// 	}
// 	@SubscribeMessage('hello player')
// 	async handleMessageP(client: Socket, arg: any) {
// 	try{
// 		this.games.get(arg[0]).left_p.color = "blue";
// 		this.games.get(arg[0]).right_p.color = "red";
// 		this.games.get(arg[0]).left_p.w = arg[1] / 40;
// 		this.games.get(arg[0]).left_p.h = arg[2]  / 5;
// 		this.games.get(arg[0]).left_p.score = "0";
// 		this.games.get(arg[0]).right_p.h = arg[2]/ 5;
// 		this.games.get(arg[0]).right_p.w = arg[1] / 40;
// 		this.games.get(arg[0]).right_p.score = "0";
// 		this.games.get(arg[0]).left_p.result = this.games.get(arg[0]).student1.playername + "   0";
// 		this.games.get(arg[0]).right_p.result = "0   " + this.games.get(arg[0]).student2.playername;
// 		this.games.get(arg[0]).ball.radius = arg[1] / 100;
// 		this.games.get(arg[0]).ball.x = arg[1] /2;
// 		this.games.get(arg[0]).ball.y = arg[2] /2;
// 		this.games.get(arg[0]).ball.velocityX = - this.games.get(arg[0]).ball.velocityX;
// 		this.games.get(arg[0]).ball.speed = 5;
// 		this.games.get(arg[0]).left_p.y = arg[2] /2 - this.games.get(arg[0]).left_p.h/2;
// 		this.games.get(arg[0]).right_p.y = arg[2] / 2 - this.games.get(arg[0]).right_p.h/2;
// 		this.games.get(arg[0]).right_p.x = arg[1] - this.games.get(arg[0]).right_p.w;
// 		this.games.get(arg[0]).ball.x = arg[1] / 2;
// 		this.games.get(arg[0]).ball.y = arg[2] / 2;
// 		this.server.to(arg[0]).emit('message', this.games.get(arg[0]).left_p);
// 		this.server.to(arg[0]).emit('message1', this.games.get(arg[0]).right_p);
// 		this.server.to(arg[0]).emit('message2', this.games.get(arg[0]).ball);
// 		function collision(ball:ball, player:any)
// 		{
// 			let b_top = ball.y - ball.radius;
// 			let b_bottom = ball.y + ball.radius;
// 			let b_left = ball.x - ball.radius;
// 			let b_right = ball.x + ball.radius;
		
// 			let p_top = player.y;
// 			let p_bottom = player.y + player.h;
// 			let p_left = player.x;
// 			let p_right = player.x + player.w;
// 			return b_right > p_left && b_bottom > p_top && b_left < p_right && b_top < p_bottom;
// 		}
// 		async function update()
// 		{
// 			this.server.to(arg[0]).emit('message2', this.games.get(arg[0]).ball);
// 			this.games.get(arg[0]).ball.x += this.games.get(arg[0]).ball.velocityX;	
// 			this.games.get(arg[0]).ball.y += this.games.get(arg[0]).ball.velocityY;
// 			if (this.games.get(arg[0]).ball.y + this.games.get(arg[0]).ball.radius > arg[2]  || this.games.get(arg[0]).ball.y - this.games.get(arg[0]).ball.radius < 0){
// 				this.games.get(arg[0]).ball.velocityY = - this.games.get(arg[0]).ball.velocityY;
// 			}
// 			let player: any;
// 			player = (this.games.get(arg[0]).ball.x < arg[1] / 2) ? this.games.get(arg[0]).left_p : this.games.get(arg[0]).right_p;
			
// 			if (this.games.get(arg[0]).ball.x - this.games.get(arg[0]).ball.radius < 0)
// 			{
// 				this.leftblack = 0;
// 				this.rightblack = 0;
// 				this.games.get(arg[0]).ball.speed = 5;
// 				let scoree = Number(this.games.get(arg[0]).right_p.score);
// 				scoree += 1;
// 				this.games.get(arg[0]).right_p.score = scoree.toString();
// 				this.games.get(arg[0]).right_p.result =  scoree.toString() + "   " + this.games.get(arg[0]).student2.playername;
// 				this.server.to(arg[0]).emit('message1', this.games.get(arg[0]).right_p);
// 				if (Number(this.games.get(arg[0]).right_p.score) == 3)
// 				{
// 					this.cumfromWin = true;
// 					//("the winner is:",this.games.get(arg[0]).student2.playername);
// 					this.games.get(arg[0]).socket2.emit("you win");
// 					this.games.get(arg[0]).socket1.emit("you lose");
// 					this.gamerun.set(arg[0], 0);
// 					await this.prisma.games.update({
// 						where: {
// 							gameID: arg[0],
// 						},
// 						data: {
// 							player1ID: this.games.get(arg[0]).student1.playerid,
// 							player2ID: this.games.get(arg[0]).student2.playerid,
// 							winnerID: this.games.get(arg[0]).student2.playerid,
// 							scoreP1: Number(this.games.get(arg[0]).left_p.score),
// 							scoreP2: Number(this.games.get(arg[0]).right_p.score),
// 							specialMode: false,
// 						}
// 					});
// 					await this.prisma.user.update({
// 						where: {
// 							userID: this.games.get(arg[0]).student1.playerid,
// 						},
// 						data: {
// 							userInGame : false,
// 							matchPlayed : this.games.get(arg[0]).student1.matchplayed + 1,
// 							nOfLoss : this.games.get(arg[0]).student1.nofloss + 1,
// 							winRate : ((this.games.get(arg[0]).student1.nofwins) * 100) / (this.games.get(arg[0]).student1.matchplayed + 1),
// 						}
// 					});
// 					await this.prisma.user.update({
// 						where: {
// 							userID: this.games.get(arg[0]).student2.playerid,
// 						},
// 						data: {
// 							userInGame : false,
// 							matchPlayed : this.games.get(arg[0]).student2.matchplayed + 1,
// 							nOfWins: this.games.get(arg[0]).student2.nofwins + 1,
// 							winRate : ((this.games.get(arg[0]).student2.nofwins + 1) * 100) / (this.games.get(arg[0]).student2.matchplayed + 1),
// 						}
// 					});
// 				}
// 				this.games.get(arg[0]).ball.x = arg[1] /2;
// 				this.games.get(arg[0]).ball.y = arg[2]  /2;
// 				this.games.get(arg[0]).ball.velocityX = 5;
// 				this.games.get(arg[0]).ball.velocityY = 5;
// 				this.games.get(arg[0]).ball.velocityX = -this.games.get(arg[0]).ball.velocityX;
// 			}
// 			else if (this.games.get(arg[0]).ball.x + this.games.get(arg[0]).ball.radius > arg[1])
// 			{
// 				let scoree = Number(this.games.get(arg[0]).left_p.score);
// 				scoree += 1;
// 				this.games.get(arg[0]).left_p.score = scoree.toString();
// 				this.games.get(arg[0]).left_p.result = this.games.get(arg[0]).student1.playername + "   " + scoree.toString();
// 				this.server.to(arg[0]).emit('message', this.games.get(arg[0]).left_p);
// 				if (Number(this.games.get(arg[0]).left_p.score) == 3)
// 				{
// 					this.cumfromWin = true;
// 					//("the winner is:",this.games.get(arg[0]).student1.playerid);
// 					this.games.get(arg[0]).socket1.emit("you win");
// 					this.games.get(arg[0]).socket2.emit("you lose");
// 					this.gamerun.set(arg[0], 0);
// 					await this.prisma.games.update({
// 						where: {
// 							gameID: arg[0],
// 						},
// 						data: {
// 							player1ID: this.games.get(arg[0]).student1.playerid,
// 							player2ID: this.games.get(arg[0]).student2.playerid,
// 							winnerID: this.games.get(arg[0]).student1.playerid,
// 							scoreP1: Number(this.games.get(arg[0]).left_p.score),
// 							scoreP2: Number(this.games.get(arg[0]).right_p.score),
// 							specialMode: false,
// 						}
// 					});
// 					await this.prisma.user.update({
// 						where: {
// 							userID: this.games.get(arg[0]).student1.playerid,
// 						},
// 						data: {
// 							userInGame : false,
// 							matchPlayed : this.games.get(arg[0]).student1.matchplayed + 1,
// 							nOfWins: this.games.get(arg[0]).student1.nofwins + 1,
// 							winRate : ((this.games.get(arg[0]).student1.nofwins + 1) * 100) / (this.games.get(arg[0]).student1.matchplayed + 1),
// 						}
// 					 });
// 					await this.prisma.user.update({
// 						where: {
// 							userID: this.games.get(arg[0]).student2.playerid,
// 						},
// 						data: {
// 							userInGame : false,
// 							matchPlayed : this.games.get(arg[0]).student2.matchplayed + 1,
// 							nOfLoss: this.games.get(arg[0]).student2.nofloss + 1,
// 							winRate : ((this.games.get(arg[0]).student2.nofwins) * 100) / (this.games.get(arg[0]).student2.matchplayed + 1),
// 						}
// 					});	
// 				}
// 				this.games.get(arg[0]).ball.x = arg[1] /2;
// 				this.games.get(arg[0]).ball.y = arg[2]  /2;
// 				this.games.get(arg[0]).ball.speed = 5;
// 				this.games.get(arg[0]).ball.velocityX = 5;
// 				this.games.get(arg[0]).ball.velocityY = 5;
// 				this.games.get(arg[0]).ball.velocityX = -this.games.get(arg[0]).ball.velocityX;
// 			}
// 			if (collision(this.games.get(arg[0]).ball, player))
// 			{
// 				let collidepoint = this.games.get(arg[0]).ball.y - (player.y + player.h/2);
// 				collidepoint = collidepoint / (player.h/2);
// 				let angleRad = (Math.PI/4) * collidepoint;
// 				let direction = (this.games.get(arg[0]).ball.x < arg[1] / 2) ? 1 : -1;
// 				this.games.get(arg[0]).ball.velocityX = direction * this.games.get(arg[0]).ball.speed * Math.cos(angleRad);
// 				this.games.get(arg[0]).ball.velocityY = direction * this.games.get(arg[0]).ball.speed * Math.sin(angleRad);
// 				this.games.get(arg[0]).ball.speed += 1;
// 			}
// 		}
// 		this.interv.set(arg[0] , setInterval (() => {
// 			if(this.gamerun.get(arg[0]))
// 			{
// 				if (client.id === this.games.get(arg[0]).player2)
// 				{
// 					update.call(this);
// 				}
// 			}
// 		}, 1500/50));
// 	}
// 	catch(e){}
// 	}
// handleConnection(client: Socket) {
// 	this.logger.log(`Client Connected: ${client.id}`);
// }
// }
import { Controller, Get, Logger, Req, Res, UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Player, ids} from './component';
import {ball, } from './component';
import { subscribe } from 'diagnostics_channel';
import { io, Socket} from 'socket.io-client'; 
import { Game } from './component';
import { AuthGuard } from '@nestjs/passport';
import { GameService } from './game.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
@WebSocketGateway({
    cors: {
        origin: '*',
        credentials: true,
    },
    namespace: '/classicvip',
})
	export class ClassicVip implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
		private logger: Logger = new Logger('AppGateway');
		constructor(private readonly gameService: GameService) {};
		private interval: NodeJS.Timeout | null = null;
		private out: Map<string, any> = new Map();
		private games: Map<string, Game> = new Map<string, Game>();
		private roomname1 : Map<string, string> = new Map<string, string>();
		private players : Map<string, Socket[]> = new Map();
		private creategame : Map<string, boolean> = new Map<string, boolean>();
		private gamerun : Map<string, number> = new Map<string, number>();
		private interv : Map<string,NodeJS.Timeout| null > = new Map<string, NodeJS.Timeout| null>();
		private socketMap: Map<string, any[]> = new Map<string, any[]>();
		// private game: Map<string, any> = new Map<string, any>();
		private playerdata1: Player[];
		private playerdata2: Player[];
		private playerdata : Map<string, Player[]> = new Map<string, Player[]>();
		private prisma = new PrismaService();
		server : Server;
		player1socket: Socket;
		player2socket: Socket;
		afterInit(server: Server) {
			this.server = server;
			this.logger.log('Initialized');
		}
		init = false;
		j = 0;
		p1 = 0;
		p2 = 1;
		enter = true;
		enter1 = true;
		leftblack = 0;
		rightblack = 0;
		leftchance = 0;
		rightchance = 0;
		first = 0;
		game: any;
		daroom : any;
		forbiden = false;
		deja = 0;
		cumfromWin = false;
		goodbye = false;
		socketIds = [];
		async handleDisconnect(client: Socket) {
		try{
		this.logger.log(` Client Disconnected: ${client.id}`);
		let interval = this.interv.get(this.roomname1.get(`${client.id}`));
		if (interval) {
			clearInterval(interval);
			interval = null;
		}
		this.server.to(this.roomname1.get(`${client.id}`)).emit('finish');
		this.gamerun.set(this.roomname1.get(`${client.id}`), 0);
		if (this.forbiden)
		{
			//("get out");
			this.forbiden = false;
		}
		else if (this.out.get(this.roomname1.get(`${client.id}`)))
		{
			if (client.id == this.games.get(this.roomname1.get(`${client.id}`)).student1.socketid && this.first == 0 && this.cumfromWin == false)
			{
				this.first++;
				await this.prisma.games.update({
					where: {
						gameID: this.roomname1.get(`${client.id}`),
					},
					data: {
						player1ID: this.games.get(this.roomname1.get(`${client.id}`)).student1.playerid,
						player2ID: this.games.get(this.roomname1.get(`${client.id}`)).student2.playerid,
						winnerID: this.games.get(this.roomname1.get(`${client.id}`)).student2.playerid,
						scoreP1: Number(this.games.get(this.roomname1.get(`${client.id}`)).left_p.score),
						scoreP2: Number(this.games.get(this.roomname1.get(`${client.id}`)).right_p.score),
						specialMode: false,
					}
				});
				await this.prisma.user.update({
					where: {
						userID: this.games.get(this.roomname1.get(`${client.id}`)).student1.playerid,
					},
					data: {
						userInGame : false,
						matchPlayed : this.games.get(this.roomname1.get(`${client.id}`)).student1.matchplayed + 1,
						nOfLoss: this.games.get(this.roomname1.get(`${client.id}`)).student1.nofloss + 1,
						winRate : ((this.games.get(this.roomname1.get(`${client.id}`)).student1.nofwins) * 100) / (this.games.get(this.roomname1.get(`${client.id}`)).student1.matchplayed + 1),
					}
				});
				await this.prisma.user.update({
					where: {
						userID: this.games.get(this.roomname1.get(`${client.id}`)).student2.playerid,
					},
					data: {
						userInGame : false,
						matchPlayed : this.games.get(this.roomname1.get(`${client.id}`)).student2.matchplayed + 1,
						nOfWins: this.games.get(this.roomname1.get(`${client.id}`)).student2.nofwins + 1,
						winRate : ((this.games.get(this.roomname1.get(`${client.id}`)).student2.nofwins + 1) * 100) / (this.games.get(this.roomname1.get(`${client.id}`)).student2.matchplayed + 1),
					}
				});
			}
			else if(client.id == this.games.get(this.roomname1.get(`${client.id}`)).student2.socketid && this.first == 0 && this.cumfromWin == false)
			{
				this.first++;
				await this.prisma.games.update({
					where: {
						gameID: this.roomname1.get(`${client.id}`),
					},
					data: {
						player1ID: this.games.get(this.roomname1.get(`${client.id}`)).student1.playerid,
						player2ID: this.games.get(this.roomname1.get(`${client.id}`)).student2.playerid,
						winnerID: this.games.get(this.roomname1.get(`${client.id}`)).student1.playerid,
						scoreP1: Number(this.games.get(this.roomname1.get(`${client.id}`)).left_p.score),
						scoreP2: Number(this.games.get(this.roomname1.get(`${client.id}`)).right_p.score),
						specialMode: false,
					}
				});
				await this.prisma.user.update({
					where: {
						userID: this.games.get(this.roomname1.get(`${client.id}`)).student1.playerid,
					},
					data: {
						userInGame : false,
						matchPlayed : this.games.get(this.roomname1.get(`${client.id}`)).student1.matchplayed + 1,
						nOfWins: this.games.get(this.roomname1.get(`${client.id}`)).student1.nofwins + 1,
						winRate : ((this.games.get(this.roomname1.get(`${client.id}`)).student1.nofwins + 1) * 100) / (this.games.get(this.roomname1.get(`${client.id}`)).student1.matchplayed + 1),
					}
				});
				await this.prisma.user.update({
					where: {
						userID: this.games.get(this.roomname1.get(`${client.id}`)).student2.playerid,
					},
					data: {
						userInGame : false,
						matchPlayed : this.games.get(this.roomname1.get(`${client.id}`)).student2.matchplayed + 1,
						nOfLoss: this.games.get(this.roomname1.get(`${client.id}`)).student2.nofloss + 1,
						winRate : ((this.games.get(this.roomname1.get(`${client.id}`)).student2.nofwins) * 100) / (this.games.get(this.roomname1.get(`${client.id}`)).student2.matchplayed + 1),
					}
				});
			}
		}
	}
	catch(e){}
	}
	@SubscribeMessage('set my socket')
	async handleCreateRoom(client:any, arg : any)
	{
		try{
		this.out.set(arg, this.goodbye);
		let roomName: string;
		roomName = arg;
		this.playerdata1 = await this.gameService.getPlayer();
		if (this.playerdata1[this.j].ingame == true)
		{
			while (this.playerdata1.length > 0)
			{
				this.playerdata1.pop();
			}
			this.forbiden = true;
			client.emit("already in game");
		}
		this.playerdata2 = this.playerdata.get(arg) || [];
		this.playerdata.set(arg, this.playerdata2);
		this.playerdata.get(arg).push(this.playerdata1[this.j]);
		//(this.playerdata.get(arg).length);
		this.socketIds = this.players.get(arg) || [];
		this.players.set(arg, this.socketIds);
		this.players.get(arg).push(client.id);
		const socketArray = this.socketMap.get(arg) || [];
		socketArray.push(client);
		this.socketMap.set(arg, socketArray); 
		client.emit("am waiting");
		this.creategame.set(arg, this.enter);
		this.roomname1.set(client.id, arg);
		this.j++;
		if (this.players.get(arg).length == 2)
		{
			this.out.set(arg,true);
			this.game = new Game();
			this.games.set(arg, this.game);
			this.games.get(arg).two = true;
			this.games.get(arg).player1 = this.socketMap.get(arg)[0].id;
			this.games.get(arg).socket1 = this.socketMap.get(arg)[0];
			this.games.get(arg).player2 = this.socketMap.get(arg)[1].id;
			this.games.get(arg).socket2 = this.socketMap.get(arg)[1];
			this.roomname1.set(this.games.get(arg).player2, arg);
			this.gamerun.set(arg, 1);
			let sockett = [];
			sockett = this.players.get(arg);
			let playerdata12: Player[] = this.playerdata.get(arg);
			if (playerdata12 && sockett)
			{
				if (sockett.length > 0 && playerdata12.length > 0)
				{
					playerdata12[0].socketid = sockett[0];
					playerdata12[1].socketid = sockett[1];
				}
				this.games.get(arg).student1 = playerdata12[0];
				this.games.get(arg).student2 = playerdata12[1];
			}
			this.forbiden = false;
			this.games.get(arg).two = true;
			if (playerdata12)
			{
				await this.prisma.user.update({
					where: {
						userID: playerdata12[0].playerid,
					},
					data: {
						userWaiting : false,
						userInGame : true,
					}
				});
				await this.prisma.user.update({
					where: {
						userID: playerdata12[1].playerid,
					},
					data: {
						userWaiting : false,
						userInGame : true,
					}
				});
			}
			let socketttt = this.socketMap.get(arg);
			if (socketttt.length > 0)
			{
				socketttt[0].join(roomName);
				socketttt[1].join(roomName);
			}
			this.first = 0;
			this.cumfromWin = false;
			await this.prisma.games.update({
				where: {
					gameID: arg,
				},
				data: {
					player1ID: this.games.get(arg).student1.playerid,
					player2ID: this.games.get(arg).student2.playerid,
					specialMode: false,
				}
			});
			if (this.creategame.get(arg))
			{
				this.server.to(arg).emit('matchFound', arg, this.games.get(arg).student1.playeravatar,this.games.get(arg).student2.playeravatar);
				this.creategame.set(arg, false);
			}
		}
	}
	catch(e){}
	}

	@SubscribeMessage('moveLeftPaddle')
	handleleftpaddle(client: Socket, arg: any) {
	try{
	if (this.gamerun.get(arg[1]))
	{
		if (client.id == this.games.get(arg[1]).player1) 
		{
			this.games.get(arg[1]).left_p.y = (arg[0] * 400) / 100;
			if (this.games.get(arg[1]).left_p.y > arg[2] - this.games.get(arg[1]).left_p.h)
				this.games.get(arg[1]).left_p.y = arg[2] - this.games.get(arg[1]).left_p.h;
			if (this.games.get(arg[1]).left_p.y < 0)
				this.games.get(arg[1]).left_p.y = 0;
			this.server.to(arg[1]).emit('message', this.games.get(arg[1]).left_p);
		}
		else if (client.id == this.games.get(arg[1]).player2)
		{
			this.games.get(arg[1]).right_p.y = (arg[0] * 400) / 100;
			if (this.games.get(arg[1]).right_p.y > arg[2] - this.games.get(arg[1]).right_p.h)
				this.games.get(arg[1]).right_p.y = arg[2] - this.games.get(arg[1]).right_p.h;
			if (this.games.get(arg[1]).right_p.y < 0)
				this.games.get(arg[1]).right_p.y = 0;
			this.server.to(arg[1]).emit('message1', this.games.get(arg[1]).right_p);
		}
	}
	}
	catch(e){}
	}
	@SubscribeMessage('hello player')
	async handleMessageP(client: Socket, arg: any) {
	try{
		this.games.get(arg[0]).left_p.color = "blue";
		this.games.get(arg[0]).right_p.color = "red";
		this.games.get(arg[0]).left_p.w = arg[1] / 40;
		this.games.get(arg[0]).left_p.h = arg[2]  / 5;
		this.games.get(arg[0]).left_p.score = "0";
		this.games.get(arg[0]).right_p.h = arg[2]/ 5;
		this.games.get(arg[0]).right_p.w = arg[1] / 40;
		this.games.get(arg[0]).right_p.score = "0";
		this.games.get(arg[0]).left_p.result = this.games.get(arg[0]).student1.playername + "   0";
		this.games.get(arg[0]).right_p.result = "0   " + this.games.get(arg[0]).student2.playername;
		this.games.get(arg[0]).ball.radius = arg[1] / 100;
		this.games.get(arg[0]).ball.x = arg[1] /2;
		this.games.get(arg[0]).ball.y = arg[2] /2;
		this.games.get(arg[0]).ball.velocityX = - this.games.get(arg[0]).ball.velocityX;
		this.games.get(arg[0]).ball.speed = 5;
		this.games.get(arg[0]).left_p.y = arg[2] /2 - this.games.get(arg[0]).left_p.h/2;
		this.games.get(arg[0]).right_p.y = arg[2] / 2 - this.games.get(arg[0]).right_p.h/2;
		this.games.get(arg[0]).right_p.x = arg[1] - this.games.get(arg[0]).right_p.w;
		this.games.get(arg[0]).ball.x = arg[1] / 2;
		this.games.get(arg[0]).ball.y = arg[2] / 2;
		this.server.to(arg[0]).emit('message', this.games.get(arg[0]).left_p);
		this.server.to(arg[0]).emit('message1', this.games.get(arg[0]).right_p);
		this.server.to(arg[0]).emit('message2', this.games.get(arg[0]).ball);
		function collision(ball:ball, player:any)
		{
			let b_top = ball.y - ball.radius;
			let b_bottom = ball.y + ball.radius;
			let b_left = ball.x - ball.radius;
			let b_right = ball.x + ball.radius;
		
			let p_top = player.y;
			let p_bottom = player.y + player.h;
			let p_left = player.x;
			let p_right = player.x + player.w;
			return b_right > p_left && b_bottom > p_top && b_left < p_right && b_top < p_bottom;
		}
		async function update()
		{
			this.server.to(arg[0]).emit('message2', this.games.get(arg[0]).ball);
			this.games.get(arg[0]).ball.x += this.games.get(arg[0]).ball.velocityX;	
			this.games.get(arg[0]).ball.y += this.games.get(arg[0]).ball.velocityY;
			if (this.games.get(arg[0]).ball.y + this.games.get(arg[0]).ball.radius > arg[2]  || this.games.get(arg[0]).ball.y - this.games.get(arg[0]).ball.radius < 0){
				this.games.get(arg[0]).ball.velocityY = - this.games.get(arg[0]).ball.velocityY;
			}
			let player: any;
			player = (this.games.get(arg[0]).ball.x < arg[1] / 2) ? this.games.get(arg[0]).left_p : this.games.get(arg[0]).right_p;
			
			if (this.games.get(arg[0]).ball.x - this.games.get(arg[0]).ball.radius < 0)
			{
				this.leftblack = 0;
				this.rightblack = 0;
				this.games.get(arg[0]).ball.speed = 5;
				let scoree = Number(this.games.get(arg[0]).right_p.score);
				scoree += 1;
				this.games.get(arg[0]).right_p.score = scoree.toString();
				this.games.get(arg[0]).right_p.result =  scoree.toString() + "   " + this.games.get(arg[0]).student2.playername;
				this.server.to(arg[0]).emit('message1', this.games.get(arg[0]).right_p);
				if (Number(this.games.get(arg[0]).right_p.score) == 3)
				{
					this.cumfromWin = true;
					//("the winner is:",this.games.get(arg[0]).student2.playername);
					this.games.get(arg[0]).socket2.emit("you win");
					this.games.get(arg[0]).socket1.emit("you lose");
					this.gamerun.set(arg[0], 0);
					await this.prisma.games.update({
						where: {
							gameID: arg[0],
						},
						data: {
							player1ID: this.games.get(arg[0]).student1.playerid,
							player2ID: this.games.get(arg[0]).student2.playerid,
							winnerID: this.games.get(arg[0]).student2.playerid,
							scoreP1: Number(this.games.get(arg[0]).left_p.score),
							scoreP2: Number(this.games.get(arg[0]).right_p.score),
							specialMode: false,
						}
					});
					await this.prisma.user.update({
						where: {
							userID: this.games.get(arg[0]).student1.playerid,
						},
						data: {
							userInGame : false,
							matchPlayed : this.games.get(arg[0]).student1.matchplayed + 1,
							nOfLoss : this.games.get(arg[0]).student1.nofloss + 1,
							winRate : ((this.games.get(arg[0]).student1.nofwins) * 100) / (this.games.get(arg[0]).student1.matchplayed + 1),
						}
					});
					await this.prisma.user.update({
						where: {
							userID: this.games.get(arg[0]).student2.playerid,
						},
						data: {
							userInGame : false,
							matchPlayed : this.games.get(arg[0]).student2.matchplayed + 1,
							nOfWins: this.games.get(arg[0]).student2.nofwins + 1,
							winRate : ((this.games.get(arg[0]).student2.nofwins + 1) * 100) / (this.games.get(arg[0]).student2.matchplayed + 1),
						}
					});
				}
				this.games.get(arg[0]).ball.x = arg[1] /2;
				this.games.get(arg[0]).ball.y = arg[2]  /2;
				this.games.get(arg[0]).ball.velocityX = 5;
				this.games.get(arg[0]).ball.velocityY = 5;
				this.games.get(arg[0]).ball.velocityX = -this.games.get(arg[0]).ball.velocityX;
			}
			else if (this.games.get(arg[0]).ball.x + this.games.get(arg[0]).ball.radius > arg[1])
			{
				let scoree = Number(this.games.get(arg[0]).left_p.score);
				scoree += 1;
				this.games.get(arg[0]).left_p.score = scoree.toString();
				this.games.get(arg[0]).left_p.result = this.games.get(arg[0]).student1.playername + "   " + scoree.toString();
				this.server.to(arg[0]).emit('message', this.games.get(arg[0]).left_p);
				if (Number(this.games.get(arg[0]).left_p.score) == 3)
				{
					this.cumfromWin = true;
					//("the winner is:",this.games.get(arg[0]).student1.playerid);
					this.games.get(arg[0]).socket1.emit("you win");
					this.games.get(arg[0]).socket2.emit("you lose");
					this.gamerun.set(arg[0], 0);
					await this.prisma.games.update({
						where: {
							gameID: arg[0],
						},
						data: {
							player1ID: this.games.get(arg[0]).student1.playerid,
							player2ID: this.games.get(arg[0]).student2.playerid,
							winnerID: this.games.get(arg[0]).student1.playerid,
							scoreP1: Number(this.games.get(arg[0]).left_p.score),
							scoreP2: Number(this.games.get(arg[0]).right_p.score),
							specialMode: false,
						}
					});
					await this.prisma.user.update({
						where: {
							userID: this.games.get(arg[0]).student1.playerid,
						},
						data: {
							userInGame : false,
							matchPlayed : this.games.get(arg[0]).student1.matchplayed + 1,
							nOfWins: this.games.get(arg[0]).student1.nofwins + 1,
							winRate : ((this.games.get(arg[0]).student1.nofwins + 1) * 100) / (this.games.get(arg[0]).student1.matchplayed + 1),
						}
					 });
					await this.prisma.user.update({
						where: {
							userID: this.games.get(arg[0]).student2.playerid,
						},
						data: {
							userInGame : false,
							matchPlayed : this.games.get(arg[0]).student2.matchplayed + 1,
							nOfLoss: this.games.get(arg[0]).student2.nofloss + 1,
							winRate : ((this.games.get(arg[0]).student2.nofwins) * 100) / (this.games.get(arg[0]).student2.matchplayed + 1),
						}
					});	
				}
				this.games.get(arg[0]).ball.x = arg[1] /2;
				this.games.get(arg[0]).ball.y = arg[2]  /2;
				this.games.get(arg[0]).ball.speed = 5;
				this.games.get(arg[0]).ball.velocityX = 5;
				this.games.get(arg[0]).ball.velocityY = 5;
				this.games.get(arg[0]).ball.velocityX = -this.games.get(arg[0]).ball.velocityX;
			}
			if (collision(this.games.get(arg[0]).ball, player))
			{
				let collidepoint = this.games.get(arg[0]).ball.y - (player.y + player.h/2);
				collidepoint = collidepoint / (player.h/2);
				let angleRad = (Math.PI/4) * collidepoint;
				let direction = (this.games.get(arg[0]).ball.x < arg[1] / 2) ? 1 : -1;
				this.games.get(arg[0]).ball.velocityX = direction * this.games.get(arg[0]).ball.speed * Math.cos(angleRad);
				this.games.get(arg[0]).ball.velocityY = direction * this.games.get(arg[0]).ball.speed * Math.sin(angleRad);
				this.games.get(arg[0]).ball.speed += 1;
			}
		}
		this.interv.set(arg[0] , setInterval (() => {
			if(this.gamerun.get(arg[0]))
			{
				if (client.id === this.games.get(arg[0]).player2)
				{
					update.call(this);
				}
			}
		}, 1500/50));
	}
	catch(e){}
	}
handleConnection(client: Socket) {
	this.logger.log(`Client Connected: ${client.id}`);
}
}