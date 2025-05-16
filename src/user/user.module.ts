import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from '../schema/user.schema';
import { InternalUserController } from './internal/user.controller';
import { InternalUserService } from './internal/user.service';
import { UserRepository } from './repository/user.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [InternalUserController],
  providers: [UserRepository, InternalUserService],
})
export class UserModule {}
