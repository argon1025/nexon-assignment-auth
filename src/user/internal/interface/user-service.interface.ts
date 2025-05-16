export interface IInternalUserService {
  /**
   * 사용자 생성
   * @throws {ConflictException} [USER00001] 이미 사용중인 이메일
   * @throws {InternalServerErrorException} [USER00002] 사용자 생성 실패
   */
  create(user: CreateUserOptions): Promise<CreateUserResult>;

  /**
   * 사용자 로그인
   * @throws {UnauthorizedException} [USER00003] 이메일 또는 비밀번호가 올바르지 않습니다.
   */
  login(user: LoginUserOptions): Promise<LoginUserResult>;
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

/** 사용자 로그인 정보 */
export interface LoginUserOptions {
  /** 이메일 */
  email: string;
  /** 비밀번호 */
  password: string;
}

/** 사용자 로그인 결과 */
export interface LoginUserResult {
  /** 액세스 토큰 */
  accessToken: string;
}
