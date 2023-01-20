import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer  } from "@nestjs/websockets"

@WebSocketGateway(80, { namespace: "chat"})
export class ChatGateWay {

    @WebSocketServer()
    server;

    @SubscribeMessage("1")
    handleTest(@MessageBody() message: string): void {
        console.log({ message })
        this.server.emit(`message`, message)
    }

    @SubscribeMessage("message")
    handleMessage(@MessageBody() message: string): void {
        console.log({ message })
        this.server.emit(`message`, message)
    }
}