import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { type } from 'os';
import { PrismaService } from '../prisma/prisma.service';
import { Socket, Server } from 'socket.io';
import { Client } from 'socket.io/dist/client';


@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService){}

    async get_mssg(roomId: string, userID: string){
        // const current_user = 'user2';
    try{
        const blockedUserIDs = await this.getBlockedUserIDs(userID);
        const mssg = await this.prisma.room.findUnique({
            where: { id: roomId},
            include: {
                messages: {
                    where: {
                        NOT: {
                          sendId: {in: blockedUserIDs}
                        }
                    }
                }
            },
        });
        if (!mssg) {
            throw new NotFoundException("Room not found");
        }

        return mssg.messages;
    }
    catch(e){
        throw new NotFoundException("Room not found");
    }
    }

    async getBlockedUserIDs(userID: string): Promise<string[]> {
        const friendships = await this.prisma.friendship.findMany({
            where: {
                OR: [
                    { user1ID: userID },
                    { user2ID: userID }
                ],
                friendshipStatus: 'BLOCKED'
            }
        });
    
        const blockedUserIDs = friendships.map(friendship => {
            if (friendship.user1ID === userID) {
                return friendship.user2ID;
            } else {
                return friendship.user1ID;
            }
        });
        
        return blockedUserIDs;
    }

    async getFriends(userId: string): Promise<string[]> {

        const friends = await this.prisma.friendship.findMany({
            where: {
                OR: [
                    { user1ID: userId},
                    { user2ID: userId},
                ],
                friendshipStatus: 'FRIENDS',
            }
        });

        const filter = friends.map((friends) => {
            if(friends.user1ID === userId)
                return friends.user2ID;
            else
                return friends.user1ID;
        })
        return filter;
    }

    async getrooms(userId: string) {
    try{  
        const rooms = await this.prisma.room.findMany({
            where: {
                OR: [
                    {
                        type: {
                            in: ['PUBLIC', 'PASSWORD_PROTECTED'],
                        }
                    },
                    {
                        AND: [
                            { type: 'DM' },
                            { members: { some: { userID: userId } } }
                        ]
                    },
                    {
                        AND: [
                            { type: 'PRIVATE' },
                            { members: { some: { userID: userId } } }
                        ]
                    }
                ]
            },
            select: {
                id: true,
                type: true,
                name: true,
                members: {
                    select: {
                        userID: true,
                        userName: true,
                    }
                },
                banedusers: {
                    select: {
                        userID: true,
                    }
                }
            },
        });
        return rooms;
    }
    catch(e){
        throw new ForbiddenException("Room not found");
    }
    }
    
    async Brodcast(userid:string, roomid: string, server: Server, CltMap: Map<string, string>, message: object, clt: Socket){
        const blockedusers = this.getBlockedUserIDs(userid);
        const roomName = await this.prisma.room.findUnique({
			where: {id: roomid},
			select: {name: true},
		}).then(result => result.name);
		const roomUsers = await server.in(roomName).fetchSockets();
		const socketIds = roomUsers.map(socket => socket.id);

		for(let i = 0; i < socketIds.length; i++){
			let userid = CltMap.get(socketIds[i]);
			const socket = server.of('/').sockets.get(socketIds[i]);
			if(!(await blockedusers).includes(userid)){
				socket.emit("message", message);
			}
			}
    }
    async emit_action(server: Server, userId: string, CltMap: Map<string, string>){
        var banned;
		for (const [key, value] of CltMap.entries()) {
			if (value === userId) {
				banned = key;
			}
		}
		const socket = server.of('/').sockets.get(banned);
        return socket;
		// socket.emit('banned user');
    }

    async Brodcast_delete(userid:string, roomid: string, server: Server, CltMap: Map<string, string>, clt: Socket){
        const blockedusers = this.getBlockedUserIDs(userid);
        const roomName = await this.prisma.room.findUnique({
			where: {id: roomid},
			select: {name: true},
		}).then(result => result.name);
		const roomUsers = await server.in(roomName).fetchSockets();
		const socketIds = roomUsers.map(socket => socket.id);

		for(let i = 0; i < socketIds.length; i++){
			let userid = CltMap.get(socketIds[i]);
			const socket = server.of('/').sockets.get(socketIds[i]);
			socket.emit("user ban success", roomid);
			}
    }
}

