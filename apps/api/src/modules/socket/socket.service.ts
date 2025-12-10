import { Injectable, Logger } from "@nestjs/common";
import { Namespace, Server } from "socket.io";
import { JwtService } from '@nestjs/jwt';
import { MessagesService } from '../messages/messages.service';
import { instrument } from "@socket.io/admin-ui";
import { Rooms } from '@repo/contracts';
import { SocketEvents, GroupSendRequest, GroupHistoryRequest, DmSendRequest, DmHistoryRequest } from '@repo/contracts';

@Injectable()
export class SocketService {
  private readonly logger = new Logger(SocketService.name);
  private server?: Server;

  constructor(private readonly jwt: JwtService, private readonly messages: MessagesService) {}

  setServer(server: Server) {
    this.server = server;
  }

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
      this.logger.error('socket init error', error as any);
    }
  }

  async handleConnection(client: any) {
    const userId = (client.data as any).userId;
    const lobby = Rooms.Lobby;
    const userRoom = Rooms.userRoom(userId);
    client.join(lobby);
    client.join(userRoom);
    this.messages.getUndeliveredForUser(userId).then(async (items) => {
      for (const m of items) {
        this.server?.to(userRoom).emit(SocketEvents.DmNew, {
          id: m._id.toString(),
          senderId: m.senderId,
          recipientId: m.recipientId,
          content: m.content,
          createdAt: (m.createdAt as any as Date)?.toISOString?.() || new Date().toISOString(),
        });
        await this.messages.markDelivered(m._id.toString());
      }
    });
  }

  handleDisconnect(client: any) {}

  async onGroupSend(client: any, body: GroupSendRequest) {
    const userId = (client.data as any).userId;
    const lobby = Rooms.Lobby;
    const content = String(body?.content || '').slice(0, 2000);
    const saved = await this.messages.createGroupMessage(lobby, userId, content);
    this.server?.to(lobby).emit(SocketEvents.GroupNew, {
      id: saved._id.toString(),
      room: lobby,
      senderId: saved.senderId,
      content: saved.content,
      createdAt: (saved.createdAt as any as Date)?.toISOString?.() || new Date().toISOString(),
    });
  }

  async onGroupHistory(client: any, body: GroupHistoryRequest) {
    const lobby = Rooms.Lobby;
    const limit = Math.max(1, Math.min(200, Number(body?.limit ?? 50)));
    const items = await this.messages.getRecentGroup(lobby, limit);
    client.emit(SocketEvents.GroupHistory, items.map(m => ({
      id: m._id.toString(),
      room: m.room,
      senderId: m.senderId,
      content: m.content,
      createdAt: (m.createdAt as any as Date)?.toISOString?.() || new Date().toISOString(),
    })).reverse());
  }

  async onDmSend(client: any, body: DmSendRequest) {
    const fromId = (client.data as any).userId;
    const toId = String(body?.to || '').trim();
    const content = String(body?.content || '').slice(0, 2000);
    const saved = await this.messages.createDmMessage(fromId, toId, content);
    const toRoom = Rooms.userRoom(toId);
    this.server?.to(toRoom).emit(SocketEvents.DmNew, {
      id: saved._id.toString(),
      senderId: saved.senderId,
      recipientId: saved.recipientId,
      content: saved.content,
      createdAt: (saved.createdAt as any as Date)?.toISOString?.() || new Date().toISOString(),
    });
    const hasReceivers = (this.server as any)?.adapter?.rooms?.get?.(toRoom)?.size > 0;
    if (hasReceivers) await this.messages.markDelivered(saved._id.toString());
  }

  async onDmHistory(client: any, body: DmHistoryRequest) {
    const userId = (client.data as any).userId;
    const otherId = String(body?.with || '').trim();
    const limit = Math.max(1, Math.min(200, Number(body?.limit ?? 50)));
    const items = await this.messages.getDmConversation(userId, otherId, limit);
    client.emit(SocketEvents.DmHistory, items.map(m => ({
      id: m._id.toString(),
      senderId: m.senderId,
      recipientId: m.recipientId,
      content: m.content,
      createdAt: (m.createdAt as any as Date)?.toISOString?.() || new Date().toISOString(),
      delivered: m.delivered,
    })).reverse());
  }
}
