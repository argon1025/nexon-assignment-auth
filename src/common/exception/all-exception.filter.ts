import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

import { ERROR_CODE } from './error-code';
import { ErrorResponse } from '../dto/error-response.dto';

/**
 * 서비스 내 모든 예외를 처리하는 필터
 * error-response.dto 에 정의된 형식으로 응답
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // 예외 상태 코드 확인
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // 기본 에러코드, 메시지
    let { name, message } = ERROR_CODE.INTERNAL_SERVER_ERROR;
    // 에러코드, 메시지 확인
    if (exception instanceof HttpException) {
      const res = exception.getResponse();

      if (typeof res === 'object' && res !== null && 'name' in res && 'message' in res) {
        name = res.name as string;
        message = res.message as string;
      } else if (typeof res === 'string') {
        message = res;
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // 에러 응답 반환
    const errorResponse: ErrorResponse = {
      error: {
        name,
        message,
      },
    };
    response.status(status).json(errorResponse);
  }
}
