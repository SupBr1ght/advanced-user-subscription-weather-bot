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

  // remove user from mock db
  removeUser(id: number): boolean {
    if (this.users.includes(id)) {
      // get existing user in mock db
      this.users = this.users.filter(uid => uid !== id);
      // remove user from db
      this.saveUsers();
      return true;
    }
    return false;
  }

  getUsers(): number[] {
    return this.users;
  }
}
