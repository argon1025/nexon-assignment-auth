import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from '../schema/user.schema';
import { AdminUserController } from './admin/user.controller';
import { AdminUserService } from './admin/user.service';
import { InternalUserController } from './internal/user.controller';
import { InternalUserService } from './internal/user.service';
import { UserRepository } from './repository/user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: { expiresIn: configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [InternalUserController, AdminUserController],
  providers: [UserRepository, InternalUserService, AdminUserService],
})
export class UserModule {}
