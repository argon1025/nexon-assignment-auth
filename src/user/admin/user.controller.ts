import { Body, Controller, Param, Patch } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { UpdateUserAdminReq, UpdateUserAdminRes } from './dto/update-user.dto';
import { AdminUserService } from './user.service';
import { ErrorResponse } from '../../common/dto/error-response.dto';

@Controller('auth/admin/user')
@ApiTags('[관리자 API] 사용자')
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Patch(':id')
  @ApiOperation({ summary: '사용자 수정' })
  @ApiParam({ name: 'id', description: '사용자 아이디' })
  @ApiBadRequestResponse({ description: '[USER10002] 파라미터 누락 또는 유효하지 않음', type: ErrorResponse })
  @ApiNotFoundResponse({ description: '[USER00004] 사용자를 찾을 수 없습니다.', type: ErrorResponse })
  @ApiInternalServerErrorResponse({ description: '[USER10001] 서버 오류', type: ErrorResponse })
  async update(@Param('id') id: string, @Body() updateUserAdminReq: UpdateUserAdminReq): Promise<UpdateUserAdminRes> {
    return plainToInstance(UpdateUserAdminRes, await this.adminUserService.update(id, updateUserAdminReq));
  }
}
