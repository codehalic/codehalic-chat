import { Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { instrument } from "@socket.io/admin-ui";
import { Namespace, Server } from "socket.io";
import { SocketService } from './socket.service';
import { SocketEvents, GroupSendRequest, GroupHistoryRequest, DmSendRequest, DmHistoryRequest } from '@repo/contracts';
import { Rooms } from '@repo/contracts';


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
    @WebSocketServer() server!: Server;
    constructor(private readonly service: SocketService) {}

    afterInit(nameSpace: Namespace) {
        this.service.setServer(nameSpace.server);
        this.service.afterInit(nameSpace);
    }

    handleConnection(client: any, ...args: any[]) {
        this.service.handleConnection(client);
    }

    handleDisconnect(client: any) {
        this.service.handleDisconnect(client);
    }

    @SubscribeMessage(SocketEvents.GroupSend)
    async onGroupSend(@ConnectedSocket() client: any, @MessageBody() body: GroupSendRequest) {
        return this.service.onGroupSend(client, body);
    }

    @SubscribeMessage(SocketEvents.GroupHistory)
    async onGroupHistory(@ConnectedSocket() client: any, @MessageBody() body: GroupHistoryRequest) {
        return this.service.onGroupHistory(client, body);
    }

    @SubscribeMessage(SocketEvents.DmSend)
    async onDmSend(@ConnectedSocket() client: any, @MessageBody() body: DmSendRequest) {
        return this.service.onDmSend(client, body);
    }

    @SubscribeMessage(SocketEvents.DmHistory)
    async onDmHistory(@ConnectedSocket() client: any, @MessageBody() body: DmHistoryRequest) {
        return this.service.onDmHistory(client, body);
    }
}
