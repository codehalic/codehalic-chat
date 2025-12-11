import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { UserDocument } from "../users/user.schema";

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService
  ) {}

  async issueToken(
    user: UserDocument | { _id?: any; phone: string }
  ): Promise<string> {
    const sub = (user as any)?._id
      ? String((user as any)._id)
      : (user as any).phone;
    const payload = { sub, phone: (user as any).phone };
    return this.jwt.signAsync(payload, { expiresIn: "7d" });
  }
}
