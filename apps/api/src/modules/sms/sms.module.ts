import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SmsIrService } from './smsir.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule.register({
      baseURL: 'https://api.sms.ir/v1',
      timeout: 5000,
    }),
  ],
  providers: [SmsIrService],
  exports: [SmsIrService],
})
export class SmsModule {}

