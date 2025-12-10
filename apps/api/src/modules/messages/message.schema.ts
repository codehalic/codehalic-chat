import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true, enum: ['group', 'dm'] })
  type!: 'group' | 'dm';

  @Prop()
  room?: string;

  @Prop({ required: true })
  senderId!: string;

  @Prop()
  recipientId?: string;

  @Prop({ required: true })
  content!: string;

  @Prop({ default: false })
  delivered!: boolean;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export type MessageDocument = HydratedDocument<Message>;
export const MessageSchema = SchemaFactory.createForClass(Message);

