import { Injectable } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UserService } from 'src/user/services/user.service';
import to from "await-to-js"

@Injectable()
@WebSocketGateway({ cors: '*' })
export class SocketService {
    constructor(
        private readonly userService: UserService
    ) {
        console.log("xxxx")
    }

    @WebSocketServer()
    server: Server;

    handleConnection(client, message) {
        console.log('Client connected:', client.id);
    }

    handleDisconnect(client) {
        console.log('Client disconnected:', client.id);
    }

    // handleMessage(client, message) {
    //     console.log('Client message:', client.id, message);
    //     this.server.emit('message', message);
    // }

    @SubscribeMessage("users")
    async handleUSer(@MessageBody() users: string[]): Promise<void> {
        const [err, res] = await to(this.userService.findAll())
        console.log(res)
        this.server.emit(`users`, res)
    }

    @SubscribeMessage("message")
    handleMessage(@MessageBody() message: string): void {
        console.log({ message })
        this.server.emit(`message`, message)
    }
}