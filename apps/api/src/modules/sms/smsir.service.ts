import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

type Parameter = { name: string; value: string };

@Injectable()
export class SmsIrService {
  private readonly logger = new Logger(SmsIrService.name);
  constructor(private readonly http: HttpService, private readonly config: ConfigService) {}

  async sendVerify(mobile: string, templateId: number, parameters: Parameter[]) {
    const apiKey = this.config.get<string>('SMSIR_API_KEY');
    if (!apiKey) {
      this.logger.warn('SMSIR_API_KEY is not set; skipping SMS sending');
      return { status: 0, message: 'sms_skipped' };
    }
    const body = { mobile, templateId, parameters };
    try {
      const res = await firstValueFrom(
        this.http.post('/send/verify', body, { headers: { 'x-api-key': apiKey } })
      );
      return res.data;
    } catch (e: any) {
      this.logger.error('SMS.ir verify send failed', e?.response?.data || e?.message);
      return { status: -1, message: 'sms_failed' };
    }
  }
}

