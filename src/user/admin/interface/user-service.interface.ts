import { UserRole } from '../../../common/enum/common.enum';

export interface IAdminUserService {
  /**
   * 사용자 수정
   * @throws {NotFoundException} [USER00004] 사용자를 찾을 수 없습니다.
   * @throws {InternalServerErrorException} [USER00005] 사용자 수정 실패
   */
  update(id: string, updateData: UpdateUserOptions): Promise<UpdateUserResult>;
}

/** 사용자 수정 옵션 */
export interface UpdateUserOptions {
  /** 이름 */
  name?: string;
  /** 역할 */
  role?: UserRole;
}

/** 사용자 수정 결과 */
export interface UpdateUserResult {
  /** 수정된 사용자 아이디 */
  id: string;
}
