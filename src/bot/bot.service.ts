import { InjectBot, Start, Update, Command } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { WeatherService } from '../weather/weather.service';
import { UsersService } from '../user/user.service';
import * as cron from 'node-cron';

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
    await ctx.reply('Hello type /subscribe to get notification about weather in particular time!');
  }

  @Command('subscribe')
  async subscribe(ctx: Context) {
    const id = ctx.chat?.id;
    const added = this.usersService.addUser(id!);
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
    const removed = this.usersService.removeUser(id!);
    if (removed) {
      await ctx.reply('You have unsubscribed successfuly!');
    } else {
      await ctx.reply('You haven\'\nt subscribed yet! ');
    }
  }

  setupDailyWeatherTask() {
    cron.schedule('0 8 * * *', async () => {
      const users = this.usersService.getUsers();
      const weather = await this.weatherService.getWeather();
      for (const id of users) {
        await this.bot.telegram.sendMessage(id, weather);
      }
    });
  }
}
