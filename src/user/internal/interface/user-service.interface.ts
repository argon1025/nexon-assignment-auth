export interface IInternalUserService {
  /** 사용자 생성 */
  create(user: CreateUserOptions): Promise<CreateUserResult>;
}

/** 사용자 생성 정보 */
export interface CreateUserOptions {
  /** 이메일 */
  email: string;
  /** 비밀번호 */
  password: string;
  /** 이름 */
  name: string;
}

/** 사용자 생성 결과 */
export interface CreateUserResult {
  /** 사용자 아이디 */
  id: string;
}
