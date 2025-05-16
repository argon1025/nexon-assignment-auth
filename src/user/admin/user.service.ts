import { Injectable, NotFoundException } from '@nestjs/common';

import { IAdminUserService, UpdateUserOptions, UpdateUserResult } from './interface/user-service.interface';
import { ERROR_CODE } from '../../common/exception/error-code';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class AdminUserService implements IAdminUserService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * 사용자 수정
   * @throws {NotFoundException} [USER00004] 사용자를 찾을 수 없습니다.
   * @throws {InternalServerErrorException} [USER00005] 사용자 수정 실패
   */
  async update(id: string, updateData: UpdateUserOptions): Promise<UpdateUserResult> {
    // 사용자 조회
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException(ERROR_CODE.USER_NOT_FOUND);

    // 사용자 수정
    return this.userRepository.update(id, updateData);
  }
}
