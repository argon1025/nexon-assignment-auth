import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserReq {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: '이메일', example: 'test@test.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({ description: '비밀번호 (8자 이상)', example: 'password' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '이름', example: '홍길동' })
  name: string;
}

@Exclude()
export class CreateUserRes {
  @Expose()
  @ApiProperty({ description: '생성된 사용자 아이디', example: '68275fede4fdf52e54db13de' })
  id: string;
}
