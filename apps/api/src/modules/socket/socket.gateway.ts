import { Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { instrument } from "@socket.io/admin-ui";
import { Namespace, Server } from "socket.io";
import { JwtService } from '@nestjs/jwt';


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
    constructor(private readonly jwt: JwtService) {}

    afterInit(nameSpace: Namespace) {
        try {
            instrument(nameSpace.server, {
                auth: false,
                mode: 'production',
            });
            nameSpace.use(async (socket, next) => {
                try {
                    const authHeader = socket.handshake.headers['authorization'] as string | undefined;
                    const bearer = authHeader?.startsWith('Bearer ')
                      ? authHeader.substring('Bearer '.length)
                      : undefined;
                    const token = bearer || (socket.handshake.auth as any)?.token || (socket.handshake.query as any)?.token;
                    if (!token) return next(new Error('Unauthorized'));
                    const payload = await this.jwt.verifyAsync(token);
                    (socket.data as any).userId = payload.sub;
                    return next();
                } catch (err) {
                    return next(new Error('Unauthorized'));
                }
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
