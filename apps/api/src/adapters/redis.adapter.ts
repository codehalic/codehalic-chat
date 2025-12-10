import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions, Server, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient, RedisClientType } from 'redis';
import { Logger } from '@nestjs/common';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor?: ReturnType<typeof createAdapter>;
  private readonly logger = new Logger(RedisIoAdapter.name);
  constructor(app: any) {
    super(app);
  }

  async connectToRedis(): Promise<void> {
    try {
      const pubClient: RedisClientType = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
      });
      const subClient: RedisClientType = pubClient.duplicate();
      await Promise.all([pubClient.connect(), subClient.connect()]);
      this.adapterConstructor = createAdapter(pubClient, subClient);
      this.logger.log('Connected to Redis and initialized Redis adapter');
    } catch (e) {
      this.logger.warn('Redis connection failed, using default in-memory adapter');
    }
  }

  createIOServer(port: number, options?: ServerOptions): Server {
    const server = super.createIOServer(port, options);
    if (this.adapterConstructor) server.adapter(this.adapterConstructor);
    this.setupNamespaceRestrictions(server);
    return server;
  }

  private setupNamespaceRestrictions(server: Server): void {
    const defaultNamespace = server.of('/');

    defaultNamespace.use((socket: Socket, next: (err?: Error) => void) => {
      const error = new Error(
        "Access to default namespace '/' is not allowed.",
      );
      this.logger.warn(
        `Rejected connection to '/' namespace from ${socket.handshake.address}`,
      );
      return next(error);
    });

    this.logger.log("Namespace restrictions applied: Only '/chat' is allowed.");
  }
}
