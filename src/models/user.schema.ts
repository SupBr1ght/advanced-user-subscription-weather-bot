import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UserSubscription {
  @Prop({ required: true })
  chatId: number;

  @Prop({ required: true })
  cronTime: string;

  @Prop({ default: 'Europe/Kyiv' })
  timeZone: string;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop({ default: true, required: true })
  enabled: boolean;
}

export type UserSubscriptionDocument = UserSubscription & Document;

export const UserSubscriptionSchema = SchemaFactory.createForClass(UserSubscription);
