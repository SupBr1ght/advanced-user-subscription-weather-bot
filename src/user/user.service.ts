import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserSubscription } from '../models/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserSubscription.name)
    private readonly userModel: Model<UserSubscription>,
  ) { }

  // save user to db
  async addUser(data: {
    chatId: number;
    cronTime: string;
    latitude: number;
    longitude: number;
    timeZone?: string;
  }): Promise<boolean> {
    const exists = await this.userModel.findOne({ chatId: data.chatId });
    if (exists) return false;

    await this.userModel.create({
      ...data,
      enabled: true,
    });

    return true;
  }

  // remove user from  db
  async removeUser(chatId: number): Promise<boolean> {
    const result = await this.userModel.deleteOne({ chatId });
    return result.deletedCount > 0;
  }

  // check if user subscribe on servise true/false
  async isSubscribed(chatId: number): Promise<boolean> {
    const user = await this.userModel.findOne({ chatId });
    if (user) {
      return true;
    } else {
      return false;
    }
  }

  async getUsers(): Promise<UserSubscription[]> {
    return this.userModel.find();
  }

  // add service to update crontime for users preferences
  async updateCronTime(chatId: number, time: string): Promise<boolean> {
    const user = await this.userModel.findOne({ chatId });
    if (!user) return false;

    user.cronTime = time;
    await user.save();
    return true;
  }

  // update user geo
  async updateLocation(chatId: number, latitude: number, longitude: number): Promise<boolean> {
    const result = await this.userModel.updateOne(
      { chatId },
      { $set: { latitude, longitude } }
    );
    return result.modifiedCount > 0;
  }
}