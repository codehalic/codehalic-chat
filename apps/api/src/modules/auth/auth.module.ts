import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { RedisModule } from '../redis/redis.module';
import { AuthController } from './auth.controller';
import { OtpService } from './otp.service';
import { AuthService } from './auth.service';
import { SmsModule } from '../sms/sms.module';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    RedisModule,
    SmsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'dev-secret',
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [OtpService, AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
