import { randomUUID } from 'crypto';

import {
  BadRequestException,
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { Request } from 'express';
import { ClsModule } from 'nestjs-cls';

import { AllExceptionsFilter } from './common/exception/all-exception.filter';
import { ERROR_CODE } from './common/exception/error-code';
import { RequestLoggingMiddleware } from './common/middleware/request-logging.middleware';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV ?? 'local'}`],
      isGlobal: true,
      cache: true,
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: (req: Request) => {
          // asyncLocalStorage, 헤더에 x-request-id 추가
          const headerValue = req.headers['x-request-id'];
          const requestId = (Array.isArray(headerValue) ? headerValue[0] : headerValue) ?? randomUUID().split('-')[0];
          req.res?.setHeader('x-request-id', requestId);
          return requestId;
        },
      },
    }),
  ],
  controllers: [HealthController],
  providers: [
    {
      /** 직렬화 인터셉터 */
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidUnknownValues: true,
        exceptionFactory: () => {
          return new BadRequestException(ERROR_CODE.PARAMETER_INVALID);
        },
      }),
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
