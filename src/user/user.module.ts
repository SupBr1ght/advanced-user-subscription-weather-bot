import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSubscription, UserSubscriptionSchema } from '../models/user.schema';
import { UsersService } from './user.service';

@Module({
  imports: [
    // import user's schema to module
    MongooseModule.forFeature([
      { name: UserSubscription.name, schema: UserSubscriptionSchema },
    ]),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
