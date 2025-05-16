import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UserRepository } from '../repository/user.repository';
import { IInternalUserService, CreateUserOptions, CreateUserResult } from './interface/user-service.interface';
import { UserRole } from '../../common/enum/common.enum';
import { ERROR_CODE } from '../../common/exception/error-code';

@Injectable()
export class InternalUserService implements IInternalUserService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * 사용자 생성
   * @throws {ConflictException} [USER00001] 이미 사용중인 이메일
   * @throws {InternalServerErrorException} [USER00002] 사용자 생성 실패
   */
  async create(user: CreateUserOptions): Promise<CreateUserResult> {
    // 이메일 중복 체크
    const existingUser = await this.userRepository.findByEmail(user.email);
    if (existingUser) {
      throw new ConflictException(ERROR_CODE.DUPLICATE_EMAIL);
    }

    // 비밀번호 암호화 (bcrypt)
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // 사용자 생성
    const { id } = await this.userRepository.create({ ...user, password: hashedPassword, role: UserRole.USER });

    return { id };
  }
}
