import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async findByPhone(phone: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ phone }).exec();
  }

  async upsertProfile(phone: string, firstName?: string, lastName?: string): Promise<UserDocument> {
    const update: Partial<User> = {};
    if (firstName !== undefined) update.firstName = firstName;
    if (lastName !== undefined) update.lastName = lastName;
    return this.userModel
      .findOneAndUpdate(
        { phone },
        { $set: { phone, ...update } },
        { new: true, upsert: true }
      )
      .exec();
  }

  async markProfileCompleted(phone: string): Promise<UserDocument | null> {
    return this.userModel
      .findOneAndUpdate(
        { phone },
        { $set: { profileCompleted: true } },
        { new: true }
      )
      .exec();
  }

  async findAllMinimal(limit = 200): Promise<Pick<User, 'phone' | 'firstName' | 'lastName'>[]> {
    return this.userModel
      .find({}, { phone: 1, firstName: 1, lastName: 1 })
      .limit(Math.max(1, Math.min(1000, limit)))
      .exec() as any;
  }
}
