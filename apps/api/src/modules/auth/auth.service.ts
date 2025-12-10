import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../users/user.schema';

@Injectable()
export class AuthService {
  constructor(private readonly users: UsersService, private readonly jwt: JwtService) {}

  async issueToken(user: UserDocument): Promise<string> {
    const payload = { sub: user._id.toString(), phone: user.phone };
    return this.jwt.signAsync(payload, { expiresIn: '7d' });
  }
}
