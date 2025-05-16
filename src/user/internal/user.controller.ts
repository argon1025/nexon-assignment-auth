import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { CreateUserReq, CreateUserRes } from './dto/create-user.dto';
import { InternalUserService } from './user.service';
import { ErrorResponse } from '../../common/dto/error-response.dto';

@Controller('auth/internal/user')
@ApiTags('사용자')
export class InternalUserController {
  constructor(private readonly internalUserService: InternalUserService) {}

  @Post()
  @ApiOperation({ summary: '사용자 생성' })
  @ApiBadRequestResponse({ description: '파라미터 누락 또는 유효하지 않음', type: ErrorResponse })
  @ApiConflictResponse({ description: '이미 사용중인 이메일입니다.', type: ErrorResponse })
  @ApiInternalServerErrorResponse({ description: '서버 오류', type: ErrorResponse })
  async create(@Body() createUserReq: CreateUserReq): Promise<CreateUserRes> {
    return plainToInstance(CreateUserRes, await this.internalUserService.create(createUserReq));
  }
}
