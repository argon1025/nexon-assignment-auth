import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserReq {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: '이메일', example: 'test@test.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '비밀번호', example: 'password' })
  password: string;
}

export class LoginUserRes {
  @ApiProperty({ description: '액세스 토큰', example: 'access_token' })
  accessToken: string;
}
