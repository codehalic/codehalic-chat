import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private readonly ttlSeconds = 2 * 60;

  constructor(private readonly redis: RedisService) {}

  private key(phone: string): string {
    return `otp:${phone}`;
  }

  async ttl(phone: string): Promise<number> {
    try {
      const client = this.redis.getClient();
      const t = await client.ttl(this.key(phone));
      return t > 0 ? t : 0;
    } catch (e) {
      this.logger.error('redis ttl failed', e as any);
      return 0;
    }
  }

  async generateAndStore(phone: string): Promise<string> {
    const client = this.redis.getClient();
    const remain = await client.ttl(this.key(phone));
    if (remain > 0) {
      throw Object.assign(new Error('cooldown'), { remain });
    }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    await client.set(this.key(phone), code, { EX: this.ttlSeconds });
    this.logger.log(`OTP generated for ${phone}`);
    return code;
  }

  async verify(phone: string, code: string): Promise<boolean> {
    const client = this.redis.getClient();
    const stored = await client.get(this.key(phone));
    if (!stored) return false;
    const match = stored === code;
    if (match) await client.del(this.key(phone));
    return match;
  }
}
