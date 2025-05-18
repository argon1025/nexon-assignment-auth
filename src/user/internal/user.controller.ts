import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { CreateUserReq, CreateUserRes } from './dto/create-user.dto';
import { GetUserByIdRes } from './dto/get-user-by-id.dto';
import { LoginUserReq, LoginUserRes } from './dto/login-user.dto';
import { InternalUserService } from './user.service';
import { ErrorResponse } from '../../common/dto/error-response.dto';

@Controller('auth/internal/user')
@ApiTags('[내부 API] 사용자')
export class InternalUserController {
  constructor(private readonly internalUserService: InternalUserService) {}

  @Post()
  @ApiOperation({ summary: '사용자 생성' })
  @ApiBadRequestResponse({ description: '[USER10002] 파라미터 누락 또는 유효하지 않음', type: ErrorResponse })
  @ApiConflictResponse({ description: '[USER00001] 이미 사용중인 이메일입니다.', type: ErrorResponse })
  @ApiInternalServerErrorResponse({ description: '[USER10001]서버 오류', type: ErrorResponse })
  async create(@Body() createUserReq: CreateUserReq): Promise<CreateUserRes> {
    return plainToInstance(CreateUserRes, await this.internalUserService.create(createUserReq));
  }

  @Post('login')
  @ApiOperation({ summary: '사용자 로그인' })
  @ApiBadRequestResponse({ description: '[USER10002] 파라미터 누락 또는 유효하지 않음', type: ErrorResponse })
  @ApiUnauthorizedResponse({ description: '[USER00003] 아이디가 올바르지 않습니다.', type: ErrorResponse })
  @ApiInternalServerErrorResponse({ description: '[USER10001] 서버 오류', type: ErrorResponse })
  async login(@Body() loginUserReq: LoginUserReq): Promise<LoginUserRes> {
    return plainToInstance(LoginUserRes, await this.internalUserService.login(loginUserReq));
  }

  @Get(':id')
  @ApiOperation({ summary: '사용자 정보 조회' })
  @ApiParam({ name: 'id', description: '사용자 아이디', example: '68275fede4fdf52e54db13de' })
  @ApiNotFoundResponse({ description: '[USER00004] 사용자를 찾을 수 없습니다.', type: ErrorResponse })
  @ApiInternalServerErrorResponse({ description: '[USER10001] 서버 오류', type: ErrorResponse })
  async findById(@Param('id') id: string): Promise<GetUserByIdRes> {
    return plainToInstance(GetUserByIdRes, await this.internalUserService.findById(id));
  }
}
