import { InjectBot, Start, Update, Command, Ctx, On } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { WeatherService } from '../weather/weather.service';
import { UsersService } from '../user/user.service';
import * as cron from 'node-cron';
import { isTextMessage } from 'src/helper/message.guard';
import { Markup } from 'telegraf';

@Update()
export class BotService {
  constructor(
    private weatherService: WeatherService,
    private usersService: UsersService,
    @InjectBot() private bot: any
  ) {
    // run once after initialization dependencies
    this.setupDailyWeatherTask();
  }

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Hello type /subscribe to get notification about weather in particular time!' +
      'If you want to change your geo or time when bot will send you message please type / location or / settime');
  }

  @Command('subscribe')
  async subscribe(ctx: Context) {
    const id = ctx.chat?.id;
    const added = await this.usersService.addUser({
      chatId: id!,
      cronTime: '0 8 * * *', // 8:00 by default
      latitude: 50.4501,
      longitude: 30.5234,
      timeZone: 'Europe/Kyiv',
    });
    if (added) {
      await ctx.reply('You have subscribed successfuly!');
    } else {
      await ctx.reply('You are  already subscribed! ');
    }
  }

  @Command('unsubscribe')
  async unsubscribe(ctx: Context) {
    const id = ctx.chat?.id;
    // remove user from db
    const removed = await this.usersService.removeUser(id!);
    if (removed) {
      await ctx.reply('You have unsubscribed successfuly!');
    } else {
      await ctx.reply('You haven\'\nt subscribed yet! ');
    }
  }

  setupDailyWeatherTask() {
    cron.schedule('0 8 * * *', async () => {
      const users = await this.usersService.getUsers();
      const weather = await this.weatherService.getWeather();
      for (const id of users) {
        await this.bot.telegram.sendMessage(id, weather);
      }
    });
  }

  @Command('settime')
  async setTime(@Ctx() ctx: Context) {
    const chatId = ctx.chat?.id;

    if (!isTextMessage(ctx.message)) {
      return ctx.reply('Please send a text message like /settime 08:30');
    }
    const messageText = ctx.message?.text;

    // e.g ["/settime", "08:30"]
    const answer = messageText?.split(' ');
    if (answer?.length !== 2) {
      return ctx.reply('Please provide time like /settime 09:30');
    }
    // get time
    const time = answer[1];

    // validate correct format like hh:mm
    const isValidTime = /^\d{2}:\d{2}$/.test(time);

    if (!isValidTime) {
      return ctx.reply('Time must be in HH:MM format, e.g. /settime 08:45');
    }
    // invoke method to save uodated time into db
    const updated = await this.usersService.updateCronTime(chatId!, time);
    if (updated) {
      ctx.reply(`Time updated! We'll message you at ${time}`);
    } else {
      ctx.reply(`You are not subscribed yet. Use /subscribe first.`);
    }
  }

  @Command('location')
  async requestLocation(@Ctx() ctx: Context) {
    return ctx.reply(
      'Please share your location so we can send you weather updates for your area:',
      Markup.keyboard([
        Markup.button.locationRequest('Share Location'),
      ])
        .resize()
        .oneTime()
    );
  }

  @On('location')
  async handleLocation(@Ctx() ctx: Context) {
    const chatId = ctx.chat?.id;
    const location = ctx.message?.location;

    if (!location) {
      return ctx.reply('Could not get your location.');
    }

    const { latitude, longitude } = location;

    // update user's location
    const updated = await this.usersService.updateLocation(chatId!, latitude, longitude);
    if (updated) {
      ctx.reply(`Location updated! (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
    } else {
      ctx.reply(`You are not subscribed yet. Use /subscribe first.`);
    }
  }

}
