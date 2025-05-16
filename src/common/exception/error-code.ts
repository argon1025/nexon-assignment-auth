import { ErrorDetail } from '../dto/error-response.dto';

/**
 * 서비스에서 리턴할 수 있는 에러 코드를 정의
 */
export const ERROR_CODE: Record<string, ErrorDetail> = {
  INTERNAL_SERVER_ERROR: { name: 'INTERNAL_SERVER_ERROR', message: '서버 오류' },
  PARAMETER_INVALID: { name: 'PARAMETER_INVALID', message: '파라미터 누락 또는 유효하지 않음' },

  /** 사용자 생성 */
  DUPLICATE_EMAIL: { name: 'USER00001', message: '이미 사용중인 이메일입니다.' },
  USER_CREATE_FAILED: { name: 'USER00002', message: '사용자 생성 실패' },
};
