import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { WeatherService } from '../weather/weather.service';
import { UsersService } from '../user/user.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [BotService, WeatherService, UsersService],
})
export class BotModule { }
