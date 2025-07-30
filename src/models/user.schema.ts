import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UserSubscription extends Document {
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

export const UserSubscriptionSchema = SchemaFactory.createForClass(UserSubscription);
