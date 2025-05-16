import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { UserRole } from '../../../common/enum/common.enum';

export class UpdateUserAdminReq {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: '이름', example: '홍길동' })
  name?: string;

  @IsEnum(UserRole)
  @IsOptional()
  @ApiProperty({ description: '역할' })
  role?: UserRole;
}

@Exclude()
export class UpdateUserAdminRes {
  @Expose()
  @ApiProperty({ description: '수정된 사용자 아이디' })
  id: string;
}
