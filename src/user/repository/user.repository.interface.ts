import { UserRole } from '../../common/enum/common.enum';

/**
 * UserRepository 인터페이스
 */
export interface IUserRepository {
  /** 이메일로 사용자 검색 */
  findByEmail(email: string): Promise<FindByEmailResult | null>;

  /**
   * 사용자 생성
   * @throws {ConflictException} 이미 사용중인 이메일
   * @throws {InternalServerErrorException} 사용자 생성 실패
   */
  create(user: CreateUserOptions): Promise<CreateUserResult>;
}

/** 이메일로 사용자 검색 결과 */
export interface FindByEmailResult {
  /** 사용자 아이디 */
  id: string;
  /** 이메일 */
  email: string;
  /** 비밀번호 */
  password: string;
  /** 이름 */
  name: string;
  /** 역할 */
  role: UserRole;
}

/** 사용자 생성 정보 */
export interface CreateUserOptions {
  /** 이메일 */
  email: string;
  /** 비밀번호 */
  password: string;
  /** 이름 */
  name: string;
  /** 역할 */
  role: UserRole;
}

/** 사용자 생성 결과 */
export interface CreateUserResult {
  /** 사용자 아이디 */
  id: string;
}
