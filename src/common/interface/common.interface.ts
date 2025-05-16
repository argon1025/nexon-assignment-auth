import { UserRole } from '../enum/common.enum';

/** 액세스 토큰 페이로드 */
export interface AccessTokenPayload {
  /** 사용자 아이디 */
  id: string;
  /** 역할 */
  role: UserRole;
  /** 이메일 */
  email: string;
}
