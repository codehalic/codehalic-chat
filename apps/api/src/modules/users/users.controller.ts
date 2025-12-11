import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('list')
  async list() {
    try {
      const items = await this.users.findAllMinimal(200);
      return { ok: true, users: items.map(u => ({
        id: (u as any)._id.toString(),
        phone: u.phone,
        firstName: u.firstName,
        lastName: u.lastName,
      })) };
    } catch (e) {
      return { ok: false, users: [] };
    }
  }
}

