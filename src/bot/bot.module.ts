import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { WeatherService } from '../weather/weather.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/user/user.module';

@Module({
  imports: [HttpModule, ConfigModule, UsersModule],
  providers: [BotService, WeatherService],
})
export class BotModule { }
