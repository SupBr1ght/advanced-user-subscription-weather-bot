import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotModule } from './bot/bot.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // connect .env file globally
    ConfigModule.forRoot({ isGlobal: true }),
    // connect telegram bot
    TelegrafModule.forRoot({
      // force to point typescript that .env with this variable exist by '!'
      token: process.env.BOT_TOKEN!,
    }),
    BotModule,
  ],
})
export class AppModule {}
