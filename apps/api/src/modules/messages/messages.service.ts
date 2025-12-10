import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './message.schema';

@Injectable()
export class MessagesService {
  constructor(@InjectModel(Message.name) private readonly model: Model<MessageDocument>) {}

  async createGroupMessage(room: string, senderId: string, content: string): Promise<MessageDocument> {
    return this.model.create({ type: 'group', room, senderId, content });
  }

  async createDmMessage(senderId: string, recipientId: string, content: string): Promise<MessageDocument> {
    return this.model.create({ type: 'dm', senderId, recipientId, content, delivered: false });
  }

  async markDelivered(id: string): Promise<void> {
    await this.model.updateOne({ _id: id }, { $set: { delivered: true } }).exec();
  }

  async getUndeliveredForUser(userId: string): Promise<MessageDocument[]> {
    return this.model.find({ type: 'dm', recipientId: userId, delivered: false }).sort({ createdAt: 1 }).exec();
  }

  async getRecentGroup(room: string, limit = 50): Promise<MessageDocument[]> {
    return this.model.find({ type: 'group', room }).sort({ createdAt: -1 }).limit(limit).exec();
  }

  async getDmConversation(a: string, b: string, limit = 50): Promise<MessageDocument[]> {
    return this.model
      .find({ type: 'dm', $or: [ { senderId: a, recipientId: b }, { senderId: b, recipientId: a } ] })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }
}

