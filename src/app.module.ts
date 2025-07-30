import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotModule } from './bot/bot.module';
import { WeatherService } from './weather/weather.service';

@Module({
  imports: [BotModule],
  controllers: [AppController],
  providers: [AppService, WeatherService],
})
export class AppModule {}
