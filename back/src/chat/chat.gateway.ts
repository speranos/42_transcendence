import { Param, NotFoundException } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import {ChatUtils } from './utils';
import { ChatService } from './chat.service';
import { skip } from 'node:test';
import { emit } from 'node:process';
import e from 'express';
import { RoomType } from '@prisma/client'; 
import { GameService } from 'src/game/game.service';
import { Game } from 'src/game/component';


@WebSocketGateway(3056,{ cors: true })
export class ChatGateway implements	OnGatewayConnection, OnGatewayDisconnect{
	@WebSocketServer()
	server: Server;

	private CltMap = new Map<string, string>();

	constructor (private prisma: PrismaService, private ChatUtils: ChatUtils, private chatserv: ChatService, private Gameserv: GameService) {}



	async handleConnection(client: Socket, arg: any){
	try{
		const userId = client.handshake.query.userID as string;
		// arg = ['a3cf659d-afd9-4806-bc58-ec43f2905dd0', 'test'];
		this.CltMap.set(client.id, userId);
		const user = await this.prisma.user.findUnique({
			where: { userID: userId},
			select: {memberin: {
				select: {name: true}
			}},
		});
		if(user){
			const names = user.memberin.map(room => room.name);
			names.forEach(names => client.join(names));
		}
	}
	catch(e){
		throw new NotFoundException("user Not Found !");
	}
}


	async handleDisconnect(client: Socket){
	try{
		const userId = client.handshake.query.userID as string;
		this.CltMap.set(userId, client.id);
		const user = await this.prisma.user.findUnique({
			where: { userID: userId},
			select: {memberin: {
				select: {name: true}
			}},
		});
		if(user){
			const names = user.memberin.map(room => room.name);
			names.forEach(names => client.leave(names));
			this.CltMap.delete(client.id);
		}
	}
	catch(e){
		throw new NotFoundException("user Not Found !");
	}
	}
	
	@SubscribeMessage('create-room')
	async RoomCreation(client: Socket, arg: any) {
try{
		const status: RoomType = arg[1];
		const userId = client.handshake.query.userID as string;
	if(status === 'PUBLIC' || status === 'PRIVATE'){
		const room = await this.prisma.room.create({
			data: {
				userId: userId,
				name: arg[0],
				type: status,
				members: {
					connect: {
						userID: userId,
					},
				},
				RoomMembership: {
					create: {
						userID: userId,
						role: 'OWNER',
						ismuted: false,
					}
				},
			},
			include: {
				members: {
					select: {
						userID: true,
					}
				},
				RoomMembership: {
					select: {
						role: true,
					}
				}
			}
		});
		
		client.join(arg[0]);
		client.emit('room data', room);
	}
	else if(status === 'PASSWORD_PROTECTED'){
		const room = await this.prisma.room.create({
			data: {
				userId: userId,
				name: arg[0],
				type: status,
				password: await this.ChatUtils.Hash(arg[2]),
				members: {
					connect: {
						userID: userId,
					},
				},
				RoomMembership: {
					create: {
						userID: userId,
						role: 'OWNER',
						ismuted: false,
					}
				},
			},
			include: {
				members: {
					select: {
						userID: true,
					}
				},
				RoomMembership: {
					select: {
						role: true,
					}
				}
			}
		});
		client.join(arg[0]);
		client.emit('room data', room);
	}
}
catch(e){
	throw new NotFoundException("Room not found");
}
	}

	@SubscribeMessage('send message')
	async SendMessage(client: Socket, arg: any){
try{
		const userId = client.handshake.query.userID as string;
		const member = await this.ChatUtils.T_membership(userId, arg[0]);
		if(!member){
			client.emit('User dont belong to this room!');
			return;
		}
		if(member.ismuted)
		{
			const current = new Date();
			if(current > member.muteend){
				await this.prisma.roomMembership.update({
					where: {
						membershipID:{
						userID: member.userID,
						roomID: member.roomID
					}
				},
					data: {
						ismuted: false,
					}
				});
			}
			else{
				client.emit('user is muted');
				return;
			}
		}
		const mssg = await this.prisma.message.create({
			data: {
				content: arg[1] as string,
				sendId: userId,
				roomId: arg[0],
			}
		});
		this.chatserv.Brodcast(userId, member.roomID, this.server, this.CltMap, mssg, client);
		return;
	}
	catch(e){
		throw new NotFoundException("Room not found");
	}
	}



	@SubscribeMessage('delete room')
	async deletroom(client: Socket, arg: any){
	try{
		const userId = client.handshake.query.userID as string;

		const membership = await  this.ChatUtils.T_membership(userId, arg);
		if(!membership || membership.role != 'OWNER')
			return 'User dont existe OR own the privallage for this action';
		
		const roomId = membership.roomID;
		await this.chatserv.Brodcast_delete(userId, roomId, this.server, this.CltMap, client);
		await this.prisma.roomMembership.deleteMany({where: {roomID: arg}});
		await this.prisma.message.deleteMany({where: {roomId: arg}});
		await this.prisma.room.delete({where: {id: arg}});
	}
	catch(e){
		throw new NotFoundException("Room not found");
	}
	}

	@SubscribeMessage('join room')
	async JoinRoom(client: Socket, arg: any){
try{
		const userId = client.handshake.query.userID as string;

		const room = await this.prisma.room.findUnique({where: {id: arg[0]}, include: {banedusers: true}});
		const member = await this.ChatUtils.T_membership(userId, arg[0]);
		if(!room || member){
			if(member)
			{
				client.emit('joined', arg[0])
			}
			else
				console.log('room dosent existe')
			return 'User already existe OR room dosent existe';
		}
		const user = room.banedusers.some(user => user.userID === userId);
		if(user)
			return 'User is Banned From this chanel!';
		if(room.type === 'PASSWORD_PROTECTED'){
			const ismatch = await bcrypt.compare(arg[1], room.password);
			if(!ismatch)
			{
				client.emit('incorrect Pass !');
				return 'incorrect Pass !';
			}
		}
		await this.prisma.room.update({
			where: {id: arg[0]},
			data: {
				members: {
			connect: {
				userID: userId
			}
				},
				RoomMembership: {
			create: {
				userID: userId,
				role: 'MEMBER',
				ismuted: false,
			}
				}
			}
		});
		client.join(arg[0]);
		client.emit('joined', arg[0])
	}
	catch(e){
		throw new NotFoundException("Room not found");
	}
	}

	@SubscribeMessage('kick')
	async Kick(client: Socket, arg: any){
try{
		const userId = client.handshake.query.userID as string;

		const admin = await  this.ChatUtils.T_membership(userId, arg[1]);
		if(!admin || (admin.role != 'ADMIN' && admin.role != 'OWNER')){
			client.emit('User dont existe OR own the privallage for this action')
			return;
		}

		const removeduser = await  this.ChatUtils.T_membership(arg[0], arg[1]);
		if(!removeduser || removeduser.role === 'OWNER'){
			client.emit('User dont existe OR own the privallage for this action')
			return;
		}
		
		const room = await this.prisma.room.update({
			where: {
				id: removeduser.roomID,
			},
			data: {
				members: {
					disconnect: {
						userID: removeduser.userID,
					}
				}
			}
		});
		await this.prisma.roomMembership.delete({
			where: {
				membershipID: {
					userID: arg[0],
					roomID: arg[1],
				}
			}
		});
		// client.emit('user kick success');
		const Socket = await this.chatserv.emit_action(this.server, arg[0],this.CltMap);
		Socket.emit('user ban success',arg[1]);
		return;
	}
	catch(e){
		throw new NotFoundException("Room not found");
	}
	}

	@SubscribeMessage('add room pass')
	async AddRoomPass(client: Socket, arg: any){
	try{
		const userId = client.handshake.query.userID as string;

		const owner = await this.ChatUtils.T_membership(userId, arg[0]);
		
		if(!owner || owner.role != 'OWNER')
			return 'User dont existe OR own the privallage for this action';
		const room = await this.prisma.room.update({
			where: {id: arg[0]},
			data: {
				type: 'PASSWORD_PROTECTED',
				password: await  this.ChatUtils.Hash(arg[1]),
			}
		});
		return;
	}
	catch(e){
		throw new NotFoundException("Room not found");
	}
	}

	
	@SubscribeMessage('remove room pass')
	async RmRoomPass(client: Socket, arg: any){
		try{
		const userId = client.handshake.query.userID as string;

		const owner = await  this.ChatUtils.T_membership(userId, arg);
		if(!owner || owner.role != 'OWNER')
			return 'User dont existe OR own the privallage for this action';
		const room = await this.prisma.room.findUnique({where: {id: owner.roomID}});
		
			await this.prisma.room.update({
				where: {id: arg},
				data: {
					type: 'PUBLIC',
					password: null,
				},
			});
		
		return;
		}
		catch(e){
			throw new NotFoundException("Room not found");
		}
	}

	@SubscribeMessage('set admin')
	async SetAdmin(client: Socket, arg: any){
		try{
		const userId = client.handshake.query.userID as string;

		const admin = await  this.ChatUtils.T_membership(userId, arg[1]);
		if(!admin || (admin.role != 'ADMIN' && admin.role != 'OWNER'))
			return	'User dont existe OR own the privallage for this action';

		const newadmin = await  this.ChatUtils.T_membership(arg[0], arg[1]);
		if(!newadmin || (newadmin.role === 'OWNER' || newadmin.role === 'ADMIN'))
			return	'User dont existe OR own the privallage for this action';
		
		const ret = await this.prisma.roomMembership.update({
			where: {
				membershipID: {
				userID: newadmin.userID,
				roomID: newadmin.roomID
			}
		},
			data: {
				role: 'ADMIN',
			}
		});
	return;
		}
		catch(e){
			throw new NotFoundException("Room not found");
		}
	}

	@SubscribeMessage('Ban')
	async Ban(client: Socket, arg: any){
		try{
			const userId = client.handshake.query.userID as string;
			console.log(arg[0], arg[1]);
			console.log(userId);
			const admin = await  this.ChatUtils.T_membership(userId, arg[1]);
			if(!admin || admin.role === 'MEMBER'){
				console.log("admin", admin);
				return;
			}
		
		const banneduser = await  this.ChatUtils.T_membership(arg[0], arg[1]);
		if(!banneduser || banneduser.role === 'OWNER'){
			console.log("banned", banneduser);
			return;
		}
	
	console.log("BAN");
		const room = await this.prisma.room.update({
			where: {
				id: banneduser.roomID,
			},
			data: {
				members: {
					disconnect: {
						userID: banneduser.userID,
					}
				},
				banedusers: {
					connect: {
						userID: banneduser.userID,
					}
				}
			}
		});
		await this.prisma.roomMembership.delete({
			where: {
				membershipID: {
					userID: banneduser.userID,
					roomID: arg[1],
				}
			}
		});
		const Socket = await this.chatserv.emit_action(this.server, arg[0],this.CltMap);
		Socket.emit('user ban success',arg[1]);
		return;
	}
	catch(e){
		throw new NotFoundException("Room not found");
	}
	}

	@SubscribeMessage('Mute')
	async Mute(client: Socket, arg: any){
		try{
		const userId = client.handshake.query.userID as string;
		const muteuntil = new Date()
		muteuntil.setSeconds(muteuntil.getSeconds() + 30);

		const admin = await this.ChatUtils.T_membership(userId, arg[1]);
		if(!admin || (admin.role != 'ADMIN' && admin.role != 'OWNER'))
			return 'User dont existe OR own the privallage for this action';

		const muteduser = await  this.ChatUtils.T_membership(arg[0], arg[1]);
		if(!muteduser || muteduser.role === 'OWNER')
			return	'User dont existe OR own the privallage for this action';

		const member = await this.prisma.roomMembership.update({
			where: {
				membershipID: {
				userID: arg[0],
				roomID: arg[1]
			}
		},
			data: {
				ismuted: true,
				muteend: muteuntil,
			}
		});
	}
	catch(e){
		throw new NotFoundException("Room not found");
	}
	}

	@SubscribeMessage('getroom')
	async GetRoom(client: Socket, arg: any){
	try{
		const room = await this.prisma.room.findUnique({
			where: {id: arg},
			select: {
				id: true,
				name: true,
				type: true,
				members: {
					select: {
						userID: true,
						userName: true,
						avatar: true,

					}
				},
				RoomMembership: {
					select: {
						userID: true,
						role: true,
					}
				}
			}
		});
		if(!room){
			client.emit('bad id');
			return;
		}
		client.emit('room', room);
	}
	catch(e){
		throw new NotFoundException("Room not found");
	}
	}

	@SubscribeMessage('add member')
	async AddMember(client: Socket, arg: any){
		try{
		const userId = client.handshake.query.userID as string;
		const admin = await this.ChatUtils.T_membership(userId, arg[1]);
		if(!admin || (admin.role != 'ADMIN' && admin.role != 'OWNER'))
			return 'User dont existe OR own the privallage for this action';

		const room = await this.prisma.room.findUnique({where: {id: arg[1]}, include: {banedusers: true}});
		const member = await this.ChatUtils.T_membership(arg[0], arg[1]);
		if(!room || member)
			return;
		const user = room.banedusers.some(user => user.userID === arg[0]);
		if(user)
			return 'User is Banned From this chanel!';
		
		console.log('User is Banned From this chanel!')
		await this.prisma.room.update({
			where: {id: arg[1]},
			data: {
				members: {
			connect: {
				userID: arg[0]
			}
				},
				RoomMembership: {
			create: {
				userID: arg[0],
				role: 'MEMBER',
				ismuted: false,
			}
				}
			}
		});
		const socket = await this.chatserv.emit_action(this.server, arg[0], this.CltMap);
		socket.join(arg[1]);
		client.emit('joined');
	}
	catch(e){
		throw new NotFoundException("Room not found");
	}
	}

	@SubscribeMessage('leave room')
	async	leaveroom(client: Socket, arg: any){
	try{
		const userId = client.handshake.query.userID as string;
		const removeduser = await this.ChatUtils.T_membership(userId, arg);
		if(!removeduser){
			console.error('user is not member!');
			return;
		}
		if(removeduser.role === 'OWNER'){
			await this.chatserv.Brodcast_delete(userId, removeduser.roomID, this.server, this.CltMap, client);
			await this.prisma.message.deleteMany({where: { roomId: arg}});
			await this.prisma.roomMembership.deleteMany({where: {roomID: arg}});
			await this.prisma.room.delete({where: {id: arg}});
			return;
		}

		const room = await this.prisma.room.update({
			where: {
				id: removeduser.roomID,
			},
			data: {
				members: {
					disconnect: {
						userID: removeduser.userID,
					}
				}
			},
			include: {
				members: true,
			}
		});
		await this.prisma.roomMembership.delete({
			where: {
				membershipID: {
					userID: userId,
					roomID: arg,
				}
			}
		});
		client.emit('user leaved success');
	}
	catch(e){
		throw new NotFoundException("Room not found");
	}
	}
}