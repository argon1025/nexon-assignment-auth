import { ConflictException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import {
  CreateUserOptions,
  CreateUserResult,
  FindByEmailResult,
  FindByIdResult,
  IUserRepository,
} from './user.repository.interface';
import { ERROR_CODE } from '../../common/exception/error-code';
import { User, UserDocument } from '../../schema/user.schema';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findByEmail(email: string): Promise<FindByEmailResult | null> {
    const user = await this.userModel.findOne({ email });
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      password: user.password,
      name: user.name,
      role: user.role,
    };
  }

  async findById(id: string): Promise<FindByIdResult | null> {
    // 유효하지 않은 아이디인 경우 null 반환
    if (!isValidObjectId(id)) return null;

    const user = await this.userModel.findById(id);
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  async create(user: CreateUserOptions): Promise<CreateUserResult> {
    try {
      const createdUser = await this.userModel.create(user);
      return { id: createdUser.id };
    } catch (error) {
      if (error?.code === 11000) {
        throw new ConflictException(ERROR_CODE.DUPLICATE_EMAIL);
      }
      Logger.error('사용자 생성 실패', error);
      throw new InternalServerErrorException({
        ...ERROR_CODE.USER_CREATE_FAILED,
        message: error?.message || '사용자 생성 실패',
      });
    }
  }
}
