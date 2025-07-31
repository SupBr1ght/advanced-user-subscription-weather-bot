import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSubscription, UserSubscriptionSchema } from '../models/user.schema';
import { UsersService } from './user.service';
import { WeatherService } from 'src/weather/weather.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // import user's schema to module
    MongooseModule.forFeature([
      { name: UserSubscription.name, schema: UserSubscriptionSchema },
    ]),
    HttpModule,
    ConfigModule
  ],
  providers: [UsersService, WeatherService],
  exports: [UsersService],
})
export class UsersModule {}
