import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client!: RedisClientType;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const url = this.config.get<string>('REDIS_URL') || 'redis://localhost:6379';
    this.client = createClient({ url });
    try {
      await this.client.connect();
      this.logger.log('Redis client connected');
    } catch (e) {
      this.logger.warn('Failed to connect Redis client');
    }
  }

  async onModuleDestroy() {
    try {
      await this.client?.quit();
    } catch {}
  }

  getClient(): RedisClientType {
    return this.client;
  }
}

