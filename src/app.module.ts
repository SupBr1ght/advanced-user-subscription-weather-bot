import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotModule } from './bot/bot.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    // connect .env file globally
    ConfigModule.forRoot({ isGlobal: true }),
    // connect telegram bot
    TelegrafModule.forRoot({
      // force to point typescript that .env with this variable exist by '!'
      token: process.env.BOT_TOKEN!,
    }),
     MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    BotModule,
    UsersModule,
  ],
})
export class AppModule {}
