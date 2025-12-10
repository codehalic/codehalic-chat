import { Body, Controller, Post } from '@nestjs/common';
import { ChallengeDto } from './dto/challenge.dto';
import { VerifyDto } from './dto/verify.dto';
import { OtpService } from './otp.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { SmsIrService } from '../sms/smsir.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly otp: OtpService,
    private readonly users: UsersService,
    private readonly auth: AuthService,
    private readonly sms: SmsIrService,
    private readonly config: ConfigService,
  ) {}

  @Post('challenge')
  async challenge(@Body() dto: ChallengeDto) {
    await this.users.upsertProfile(dto.phone, dto.firstName, dto.lastName);
    const code = await this.otp.generateAndStore(dto.phone);
    const templateId = Number(this.config.get<string>('SMSIR_TEMPLATE_ID') || 0);
    let smsResult: any = undefined;
    if (templateId > 0) {
      smsResult = await this.sms.sendVerify(dto.phone, templateId, [{ name: 'Code', value: code }]);
    }
    const otpPreview = process.env.NODE_ENV !== 'production' ? code : undefined;
    return { ok: true, otpPreview, sms: smsResult };
  }

  @Post('verify')
  async verify(@Body() dto: VerifyDto) {
    const valid = await this.otp.verify(dto.phone, dto.code);
    if (!valid) {
      return { ok: false, error: 'invalid_code' };
    }
    const user = await this.users.markProfileCompleted(dto.phone);
    const token = await this.auth.issueToken(user!);
    return { ok: true, token, user: { id: user!._id.toString(), phone: user!.phone, firstName: user!.firstName, lastName: user!.lastName } };
  }
}

