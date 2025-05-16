import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { UserRole } from '../../../common/enum/common.enum';

@Exclude()
export class GetUserByIdRes {
  @Expose()
  @ApiProperty({ description: '사용자 아이디', example: '68275fede4fdf52e54db13de' })
  id: string;

  @Expose()
  @ApiProperty({ description: '이메일', example: 'test@test.com' })
  email: string;

  @Expose()
  @ApiProperty({ description: '이름', example: '홍길동' })
  name: string;

  @Expose()
  @ApiProperty({ description: '역할', example: UserRole.USER })
  role: UserRole;

  @Expose()
  @ApiProperty({ description: '생성일 (UTC)', example: '1997-10-25T00:00:00Z' })
  createdAt: Date;
}
