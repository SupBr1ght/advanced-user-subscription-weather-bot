import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserSubscription, UserSubscriptionDocument } from '../models/user.schema';
import { Model } from 'mongoose';
import * as cron from 'node-cron';
import { WeatherService } from '../weather/weather.service';
import { InjectBot } from 'nestjs-telegraf';
import { OnModuleInit } from '@nestjs/common';
import { DateTime } from 'luxon';


const userTasks = new Map<number, cron.ScheduledTask>();

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectModel(UserSubscription.name)
    private readonly userModel: Model<UserSubscriptionDocument>,
    private readonly weatherServise: WeatherService,
    @InjectBot() private bot: any
  ) { }

  // even after restart servises tasks will be send to users
  async onModuleInit() {
    await this.initSchedules();
  }

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

  async scheduleUserNotification(chatId: number, time: string) {
    // If we have task stop it
    if (userTasks.has(chatId)) {
      userTasks.get(chatId)!.stop();
    }

    const user = await this.userModel.findOne({ chatId });
    if (!user) return;

    const [hour, minute] = time.split(':').map(Number);


    // convert to user's timezone
    const userTime = DateTime.fromObject(
      { hour, minute },
      { zone: user.timeZone || 'Europe/Kyiv' } // fallback, якщо timezone не заданий
    );

    const utcTime = userTime.setZone('UTC');

    const cronExpr = `${utcTime.minute} ${utcTime.hour} * * *`;

    console.log(
      `Scheduling weather notification for chatId ${chatId} at ${time} (${user.timeZone || 'Europe/Kyiv'}) = ${utcTime.toFormat('HH:mm')} UTC (cron: ${cronExpr})`
    );

    const task = cron.schedule(cronExpr, async () => {
      console.log(`[TASK] Sending weather to ${chatId} at ${new Date().toISOString()}`);
      const weather = await this.weatherServise.getWeather();
      console.log('[WEATHER]', weather);
      await this.bot.telegram.sendMessage(chatId, weather);
      console.log('[BOT] Message sent');
    });

    userTasks.set(chatId, task);

    console.log(`Scheduled weather notification for chatId ${chatId} at ${time} (cron: ${cronExpr})`);
  }

  async initSchedules() {
    const users = await this.getUsers();
    for (const user of users) {
      if (user.enabled && user.cronTime) {
        await this.scheduleUserNotification(user.chatId, user.cronTime);
      }
    }
  }
}