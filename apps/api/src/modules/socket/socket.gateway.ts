import { Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { instrument } from "@socket.io/admin-ui";
import { Namespace, Server } from "socket.io";


@WebSocketGateway(8080, {
    namespace: '/chat',
    cors: {
        origin: '*',
        credentials: true,
    },
})
export class SocketGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private logger: Logger = new Logger(SocketGateway.name);

    afterInit(nameSpace: Namespace) {
        try {
            instrument(nameSpace.server, {
                auth: false,
                mode: 'production',
            });
        } catch (error) {
            this.logger.error('socket init error', error);
        }
    }

    handleConnection(client: any, ...args: any[]) {
        console.log('handleConnection');
    }

    handleDisconnect(client: any) {
        console.log('handleDisconnect');
    }
}