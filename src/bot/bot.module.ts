import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { WeatherService } from '../weather/weather.service';
import { UsersService } from '../user/user.service';

@Module({
  providers: [BotService, WeatherService, UsersService],
})
export class BotModule {}
