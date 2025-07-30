import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotModule } from './bot/bot.module';
import { WeatherService } from './weather/weather.service';
import { UserService } from './user/user.service';

@Module({
  imports: [BotModule],
  controllers: [AppController],
  providers: [AppService, WeatherService, UserService],
})
export class AppModule {}
