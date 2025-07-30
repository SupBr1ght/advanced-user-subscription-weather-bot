import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserSubscription } from '../models/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  private users: number[] = [];

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

  getUsers(): number[] {
    return this.users;
  }
}
